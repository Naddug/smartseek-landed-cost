/**
 * Supplier Graph Intelligence Service
 *
 * Graph model:
 *   Supplier → Supplier   (COMPETES_WITH, ALTERNATIVE_TO, PARTNERS_WITH, SUBSIDIARY_OF)
 *   Supplier → Buyer      (BUYS_FROM edges from buyer → supplier)
 *   Supplier → Product    (SUPPLIES)
 *
 * Dual backend — same interface, different storage:
 *   • PostgreSQL (default)  — adjacency list in graph_nodes + graph_edges tables
 *   • Neo4j (optional)      — activated when NEO4J_URI env var is set
 *
 * Usage:
 *   const g = getGraphService();
 *   await g.upsertNode({ id: "acme.com", type: "supplier", name: "Acme Corp", country: "CN" });
 *   await g.upsertEdge({ fromNode: "acme.com", toNode: "steel-wire", relation: "SUPPLIES" });
 *   const alts = await g.getAlternativeSuppliers("acme.com");
 */

import { pool } from "../db.js";
import type { GraphRelation } from "@shared/schema";

// ─── Shared types ─────────────────────────────────────────────────────────────

export type NodeType = "supplier" | "buyer" | "product";

export interface GraphNode {
  id: string;
  type: NodeType;
  name?: string | null;
  country?: string | null;
  industry?: string | null;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  fromNode: string;
  toNode: string;
  relation: GraphRelation;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface PathResult {
  path: string[];
  nodes: GraphNode[];
  length: number;
}

export interface NeighborResult extends GraphNode {
  relation: string;
  weight: number;
  direction: "in" | "out";
}

export interface CentralityResult {
  nodeId: string;
  name: string | null;
  type: string;
  degree: number;
  inDegree: number;
  outDegree: number;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  byType: Record<string, number>;
  byRelation: Record<string, number>;
}

// ─── Graph backend interface ──────────────────────────────────────────────────

export interface IGraphBackend {
  setup(): Promise<void>;
  upsertNode(node: GraphNode): Promise<void>;
  upsertEdge(edge: GraphEdge): Promise<void>;
  deleteNode(id: string): Promise<void>;
  deleteEdge(fromNode: string, toNode: string, relation: GraphRelation): Promise<void>;
  getNode(id: string): Promise<GraphNode | null>;
  getNeighbors(id: string, relation?: GraphRelation, direction?: "in" | "out" | "both"): Promise<NeighborResult[]>;
  getShortestPath(fromId: string, toId: string, maxDepth?: number): Promise<PathResult | null>;
  getAlternativeSuppliers(supplierId: string, limit?: number): Promise<GraphNode[]>;
  getCommonBuyers(supplierId1: string, supplierId2: string): Promise<GraphNode[]>;
  getSupplyChain(productId: string, depth?: number): Promise<GraphNode[]>;
  getTopCentralNodes(type?: NodeType, limit?: number): Promise<CentralityResult[]>;
  getStats(): Promise<GraphStats>;
}

// ══════════════════════════════════════════════════════════════════════════════
// PostgreSQL backend
// ══════════════════════════════════════════════════════════════════════════════

class PostgresGraphBackend implements IGraphBackend {
  private ready = false;

  async setup(): Promise<void> {
    if (this.ready) return;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS graph_nodes (
        id         TEXT PRIMARY KEY,
        type       TEXT NOT NULL CHECK (type IN ('supplier','buyer','product')),
        name       TEXT,
        country    TEXT,
        industry   TEXT,
        metadata   JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS graph_edges (
        id         SERIAL PRIMARY KEY,
        from_node  TEXT NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
        to_node    TEXT NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
        relation   TEXT NOT NULL,
        weight     INTEGER NOT NULL DEFAULT 1,
        metadata   JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE (from_node, to_node, relation)
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ge_from ON graph_edges(from_node)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ge_to   ON graph_edges(to_node)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ge_rel  ON graph_edges(relation)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_gn_type ON graph_nodes(type)`);

    this.ready = true;
    console.log("[graphService] PostgreSQL graph tables ready");
  }

  async upsertNode(n: GraphNode): Promise<void> {
    await this.setup();
    await pool.query(
      `INSERT INTO graph_nodes (id, type, name, country, industry, metadata, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET
         type     = EXCLUDED.type,
         name     = COALESCE(EXCLUDED.name, graph_nodes.name),
         country  = COALESCE(EXCLUDED.country, graph_nodes.country),
         industry = COALESCE(EXCLUDED.industry, graph_nodes.industry),
         metadata = COALESCE(EXCLUDED.metadata, graph_nodes.metadata),
         updated_at = NOW()`,
      [n.id, n.type, n.name ?? null, n.country ?? null, n.industry ?? null,
       n.metadata ? JSON.stringify(n.metadata) : null]
    );
  }

  async upsertEdge(e: GraphEdge): Promise<void> {
    await this.setup();
    // Ensure both nodes exist as stubs if not already indexed
    await pool.query(
      `INSERT INTO graph_nodes (id, type) VALUES ($1,'supplier'),($2,'supplier')
       ON CONFLICT (id) DO NOTHING`,
      [e.fromNode, e.toNode]
    );
    await pool.query(
      `INSERT INTO graph_edges (from_node, to_node, relation, weight, metadata)
       VALUES ($1,$2,$3,$4,$5::jsonb)
       ON CONFLICT (from_node, to_node, relation) DO UPDATE SET
         weight   = EXCLUDED.weight,
         metadata = COALESCE(EXCLUDED.metadata, graph_edges.metadata)`,
      [e.fromNode, e.toNode, e.relation, e.weight ?? 1,
       e.metadata ? JSON.stringify(e.metadata) : null]
    );
  }

  async deleteNode(id: string): Promise<void> {
    await pool.query(`DELETE FROM graph_nodes WHERE id = $1`, [id]);
  }

  async deleteEdge(fromNode: string, toNode: string, relation: GraphRelation): Promise<void> {
    await pool.query(
      `DELETE FROM graph_edges WHERE from_node=$1 AND to_node=$2 AND relation=$3`,
      [fromNode, toNode, relation]
    );
  }

  async getNode(id: string): Promise<GraphNode | null> {
    await this.setup();
    const r = await pool.query<GraphNode & { created_at: Date }>(
      `SELECT id, type, name, country, industry, metadata FROM graph_nodes WHERE id=$1`,
      [id]
    );
    return r.rows[0] ?? null;
  }

  async getNeighbors(
    id: string,
    relation?: GraphRelation,
    direction: "in" | "out" | "both" = "both"
  ): Promise<NeighborResult[]> {
    await this.setup();
    const relFilter = relation ? `AND e.relation = '${relation}'` : "";

    const rows: NeighborResult[] = [];

    if (direction === "out" || direction === "both") {
      const r = await pool.query<NeighborResult & { raw_direction: string }>(
        `SELECT n.id, n.type, n.name, n.country, n.industry, n.metadata,
                e.relation, e.weight, 'out' AS direction
         FROM graph_edges e
         JOIN graph_nodes n ON n.id = e.to_node
         WHERE e.from_node = $1 ${relFilter}
         ORDER BY e.weight DESC`,
        [id]
      );
      rows.push(...r.rows);
    }

    if (direction === "in" || direction === "both") {
      const r = await pool.query<NeighborResult & { raw_direction: string }>(
        `SELECT n.id, n.type, n.name, n.country, n.industry, n.metadata,
                e.relation, e.weight, 'in' AS direction
         FROM graph_edges e
         JOIN graph_nodes n ON n.id = e.from_node
         WHERE e.to_node = $1 ${relFilter}
         ORDER BY e.weight DESC`,
        [id]
      );
      rows.push(...r.rows);
    }

    return rows;
  }

  async getShortestPath(fromId: string, toId: string, maxDepth = 6): Promise<PathResult | null> {
    await this.setup();
    // BFS via recursive CTE
    const r = await pool.query<{ path: string[]; depth: number }>(
      `WITH RECURSIVE bfs AS (
         SELECT from_node, to_node, ARRAY[from_node, to_node] AS path, 1 AS depth
         FROM graph_edges
         WHERE from_node = $1
         UNION ALL
         SELECT e.from_node, e.to_node,
                bfs.path || e.to_node,
                bfs.depth + 1
         FROM graph_edges e
         JOIN bfs ON bfs.to_node = e.from_node
         WHERE NOT (e.to_node = ANY(bfs.path))
           AND bfs.depth < $3
       )
       SELECT path, depth FROM bfs WHERE to_node = $2 ORDER BY depth LIMIT 1`,
      [fromId, toId, maxDepth]
    );

    if (!r.rows[0]) return null;

    const pathIds = r.rows[0].path;
    const nodesRes = await pool.query<GraphNode>(
      `SELECT id, type, name, country, industry, metadata
       FROM graph_nodes WHERE id = ANY($1)`,
      [pathIds]
    );
    const nodeMap = Object.fromEntries(nodesRes.rows.map(n => [n.id, n]));

    return {
      path: pathIds,
      nodes: pathIds.map(id => nodeMap[id] ?? { id, type: "supplier" as NodeType }),
      length: r.rows[0].depth,
    };
  }

  async getAlternativeSuppliers(supplierId: string, limit = 10): Promise<GraphNode[]> {
    await this.setup();
    // Direct ALTERNATIVE_TO / COMPETES_WITH edges + suppliers sharing same products
    const r = await pool.query<GraphNode>(
      `SELECT DISTINCT n.id, n.type, n.name, n.country, n.industry, n.metadata
       FROM graph_nodes n
       WHERE n.type = 'supplier'
         AND n.id != $1
         AND (
           -- Direct competition/alternative edges
           EXISTS (
             SELECT 1 FROM graph_edges e
             WHERE (e.from_node = $1 AND e.to_node = n.id
                    AND e.relation IN ('ALTERNATIVE_TO','COMPETES_WITH'))
                OR (e.to_node = $1 AND e.from_node = n.id
                    AND e.relation IN ('ALTERNATIVE_TO','COMPETES_WITH'))
           )
           OR
           -- Suppliers of same products (2-hop via product nodes)
           EXISTS (
             SELECT 1 FROM graph_edges e1
             JOIN graph_edges e2 ON e1.to_node = e2.to_node
             WHERE e1.from_node = $1
               AND e2.from_node = n.id
               AND e1.relation = 'SUPPLIES'
               AND e2.relation = 'SUPPLIES'
           )
           OR
           -- Same industry + country
           EXISTS (
             SELECT 1 FROM graph_nodes src
             WHERE src.id = $1
               AND src.industry IS NOT NULL
               AND n.industry = src.industry
           )
         )
       LIMIT $2`,
      [supplierId, limit]
    );
    return r.rows;
  }

  async getCommonBuyers(supplierId1: string, supplierId2: string): Promise<GraphNode[]> {
    await this.setup();
    const r = await pool.query<GraphNode>(
      `SELECT n.id, n.type, n.name, n.country, n.industry, n.metadata
       FROM graph_nodes n
       WHERE n.type = 'buyer'
         AND EXISTS (
           SELECT 1 FROM graph_edges e
           WHERE e.from_node = n.id AND e.to_node = $1 AND e.relation = 'BUYS_FROM'
         )
         AND EXISTS (
           SELECT 1 FROM graph_edges e
           WHERE e.from_node = n.id AND e.to_node = $2 AND e.relation = 'BUYS_FROM'
         )`,
      [supplierId1, supplierId2]
    );
    return r.rows;
  }

  async getSupplyChain(productId: string, depth = 3): Promise<GraphNode[]> {
    await this.setup();
    const r = await pool.query<GraphNode>(
      `WITH RECURSIVE sc AS (
         SELECT from_node AS node_id, 0 AS depth
         FROM graph_edges
         WHERE to_node = $1 AND relation = 'SUPPLIES'
         UNION ALL
         SELECT e.from_node, sc.depth + 1
         FROM graph_edges e
         JOIN sc ON sc.node_id = e.to_node
         WHERE e.relation IN ('SUPPLIES','PARTNERS_WITH','SUBSIDIARY_OF')
           AND sc.depth < $2
       )
       SELECT DISTINCT n.id, n.type, n.name, n.country, n.industry, n.metadata
       FROM sc
       JOIN graph_nodes n ON n.id = sc.node_id`,
      [productId, depth]
    );
    return r.rows;
  }

  async getTopCentralNodes(type?: NodeType, limit = 20): Promise<CentralityResult[]> {
    await this.setup();
    const typeFilter = type ? `WHERE n.type = '${type}'` : "";
    const r = await pool.query<CentralityResult>(
      `SELECT
         n.id AS "nodeId",
         n.name,
         n.type,
         (COUNT(DISTINCT e_out.id) + COUNT(DISTINCT e_in.id)) AS degree,
         COUNT(DISTINCT e_in.id)  AS "inDegree",
         COUNT(DISTINCT e_out.id) AS "outDegree"
       FROM graph_nodes n
       LEFT JOIN graph_edges e_out ON e_out.from_node = n.id
       LEFT JOIN graph_edges e_in  ON e_in.to_node   = n.id
       ${typeFilter}
       GROUP BY n.id, n.name, n.type
       ORDER BY degree DESC
       LIMIT $1`,
      [limit]
    );
    return r.rows;
  }

  async getStats(): Promise<GraphStats> {
    await this.setup();
    const [nodes, edges, byType, byRel] = await Promise.all([
      pool.query<{ count: string }>(`SELECT COUNT(*)::int AS count FROM graph_nodes`),
      pool.query<{ count: string }>(`SELECT COUNT(*)::int AS count FROM graph_edges`),
      pool.query<{ type: string; count: string }>(
        `SELECT type, COUNT(*)::int AS count FROM graph_nodes GROUP BY type`
      ),
      pool.query<{ relation: string; count: string }>(
        `SELECT relation, COUNT(*)::int AS count FROM graph_edges GROUP BY relation`
      ),
    ]);

    return {
      totalNodes: parseInt(nodes.rows[0].count),
      totalEdges: parseInt(edges.rows[0].count),
      byType:     Object.fromEntries(byType.rows.map(r => [r.type, parseInt(r.count)])),
      byRelation: Object.fromEntries(byRel.rows.map(r => [r.relation, parseInt(r.count)])),
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Neo4j backend
// ══════════════════════════════════════════════════════════════════════════════

class Neo4jGraphBackend implements IGraphBackend {
  private driver: import("neo4j-driver").Driver;

  constructor(uri: string, user: string, password: string) {
    const neo4j = require("neo4j-driver");
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 10,
    });
  }

  async setup(): Promise<void> {
    const session = this.driver.session();
    try {
      // Uniqueness constraints double as indexes in Neo4j
      await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:SupplierNode) REQUIRE n.id IS UNIQUE`);
      await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:BuyerNode)    REQUIRE n.id IS UNIQUE`);
      await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:ProductNode)  REQUIRE n.id IS UNIQUE`);
      console.log("[graphService] Neo4j constraints ready");
    } finally {
      await session.close();
    }
  }

  private label(type: NodeType): string {
    return type === "supplier" ? "SupplierNode"
         : type === "buyer"    ? "BuyerNode"
         :                       "ProductNode";
  }

  async upsertNode(n: GraphNode): Promise<void> {
    const label = this.label(n.type);
    const session = this.driver.session();
    try {
      await session.run(
        `MERGE (x:${label} {id: $id})
         SET x.name     = $name,
             x.country  = $country,
             x.industry = $industry,
             x.type     = $type,
             x.metadata = $metadata`,
        { id: n.id, name: n.name ?? null, country: n.country ?? null,
          industry: n.industry ?? null, type: n.type,
          metadata: JSON.stringify(n.metadata ?? {}) }
      );
    } finally {
      await session.close();
    }
  }

  async upsertEdge(e: GraphEdge): Promise<void> {
    const session = this.driver.session();
    try {
      // MERGE on any label combination using generic Node label fallback
      await session.run(
        `MATCH (a {id: $from}), (b {id: $to})
         MERGE (a)-[r:${e.relation}]->(b)
         SET r.weight   = $weight,
             r.metadata = $metadata`,
        { from: e.fromNode, to: e.toNode,
          weight: e.weight ?? 1,
          metadata: JSON.stringify(e.metadata ?? {}) }
      );
    } finally {
      await session.close();
    }
  }

  async deleteNode(id: string): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(`MATCH (n {id: $id}) DETACH DELETE n`, { id });
    } finally {
      await session.close();
    }
  }

  async deleteEdge(fromNode: string, toNode: string, relation: GraphRelation): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (a {id:$from})-[r:${relation}]->(b {id:$to}) DELETE r`,
        { from: fromNode, to: toNode }
      );
    } finally {
      await session.close();
    }
  }

  async getNode(id: string): Promise<GraphNode | null> {
    const session = this.driver.session();
    try {
      const r = await session.run(`MATCH (n {id: $id}) RETURN n LIMIT 1`, { id });
      if (!r.records.length) return null;
      const props = r.records[0].get("n").properties;
      return { id: props.id, type: props.type, name: props.name,
               country: props.country, industry: props.industry };
    } finally {
      await session.close();
    }
  }

  async getNeighbors(
    id: string,
    relation?: GraphRelation,
    direction: "in" | "out" | "both" = "both"
  ): Promise<NeighborResult[]> {
    const relPart = relation ? `:${relation}` : "";
    const pattern = direction === "out"  ? `(src {id:$id})-[r${relPart}]->(n)`
                  : direction === "in"   ? `(n)-[r${relPart}]->(src {id:$id})`
                  :                       `(src {id:$id})-[r${relPart}]-(n)`;
    const dir     = direction === "out"  ? "out"
                  : direction === "in"   ? "in"
                  :                       "out";

    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH ${pattern} RETURN n, r, type(r) AS rel ORDER BY r.weight DESC`,
        { id }
      );
      return r.records.map(rec => {
        const p = rec.get("n").properties;
        return { id: p.id, type: p.type, name: p.name, country: p.country,
                 industry: p.industry, metadata: {},
                 relation: rec.get("rel"), weight: rec.get("r").properties.weight ?? 1,
                 direction: dir as "in" | "out" };
      });
    } finally {
      await session.close();
    }
  }

  async getShortestPath(fromId: string, toId: string, maxDepth = 6): Promise<PathResult | null> {
    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH (a {id:$from}), (b {id:$to}),
               p = shortestPath((a)-[*..${maxDepth}]-(b))
         RETURN p LIMIT 1`,
        { from: fromId, to: toId }
      );
      if (!r.records.length) return null;
      const segments = r.records[0].get("p").segments as Array<{
        start: { properties: Record<string, unknown> };
        end:   { properties: Record<string, unknown> };
      }>;
      const nodes: GraphNode[] = segments.flatMap((s, i) => {
        const toNode = (p: Record<string, unknown>): GraphNode => ({
          id: p.id as string, type: p.type as NodeType,
          name: p.name as string, country: p.country as string,
        });
        return i === 0 ? [toNode(s.start.properties), toNode(s.end.properties)]
                       : [toNode(s.end.properties)];
      });
      return { path: nodes.map(n => n.id), nodes, length: segments.length };
    } finally {
      await session.close();
    }
  }

  async getAlternativeSuppliers(supplierId: string, limit = 10): Promise<GraphNode[]> {
    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH (s:SupplierNode {id:$id})
         OPTIONAL MATCH (s)-[:ALTERNATIVE_TO|COMPETES_WITH]-(alt:SupplierNode)
         OPTIONAL MATCH (s)-[:SUPPLIES]->(p:ProductNode)<-[:SUPPLIES]-(shared:SupplierNode)
         WITH collect(DISTINCT alt) + collect(DISTINCT shared) AS candidates
         UNWIND candidates AS c
         WITH DISTINCT c WHERE c.id <> $id
         RETURN c LIMIT $limit`,
        { id: supplierId, limit }
      );
      return r.records.map(rec => {
        const p = rec.get("c").properties;
        return { id: p.id, type: "supplier" as NodeType, name: p.name, country: p.country };
      });
    } finally {
      await session.close();
    }
  }

  async getCommonBuyers(supplierId1: string, supplierId2: string): Promise<GraphNode[]> {
    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH (b:BuyerNode)-[:BUYS_FROM]->(s1:SupplierNode {id:$s1}),
               (b)-[:BUYS_FROM]->(s2:SupplierNode {id:$s2})
         RETURN DISTINCT b`,
        { s1: supplierId1, s2: supplierId2 }
      );
      return r.records.map(rec => {
        const p = rec.get("b").properties;
        return { id: p.id, type: "buyer" as NodeType, name: p.name, country: p.country };
      });
    } finally {
      await session.close();
    }
  }

  async getSupplyChain(productId: string, depth = 3): Promise<GraphNode[]> {
    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH (p:ProductNode {id:$id})<-[:SUPPLIES*1..${depth}]-(s)
         RETURN DISTINCT s`,
        { id: productId }
      );
      return r.records.map(rec => {
        const props = rec.get("s").properties;
        return { id: props.id, type: props.type as NodeType, name: props.name, country: props.country };
      });
    } finally {
      await session.close();
    }
  }

  async getTopCentralNodes(type?: NodeType, limit = 20): Promise<CentralityResult[]> {
    const labelFilter = type ? `(n:${this.label(type)})` : "(n)";
    const session = this.driver.session();
    try {
      const r = await session.run(
        `MATCH ${labelFilter}
         OPTIONAL MATCH (n)-[out]->()
         OPTIONAL MATCH ()-[in]->(n)
         RETURN n.id AS nodeId, n.name AS name, n.type AS type,
                count(DISTINCT out) AS outDegree,
                count(DISTINCT in)  AS inDegree,
                count(DISTINCT out) + count(DISTINCT in) AS degree
         ORDER BY degree DESC LIMIT $limit`,
        { limit }
      );
      return r.records.map(rec => ({
        nodeId: rec.get("nodeId"),
        name: rec.get("name"),
        type: rec.get("type"),
        degree: rec.get("degree").toNumber(),
        inDegree: rec.get("inDegree").toNumber(),
        outDegree: rec.get("outDegree").toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  async getStats(): Promise<GraphStats> {
    const session = this.driver.session();
    try {
      const [nodeRes, edgeRes, typeRes, relRes] = await Promise.all([
        session.run(`MATCH (n) RETURN count(n) AS c`),
        session.run(`MATCH ()-[r]->() RETURN count(r) AS c`),
        session.run(`MATCH (n) RETURN n.type AS type, count(*) AS c`),
        session.run(`MATCH ()-[r]->() RETURN type(r) AS rel, count(*) AS c`),
      ]);
      return {
        totalNodes: nodeRes.records[0].get("c").toNumber(),
        totalEdges: edgeRes.records[0].get("c").toNumber(),
        byType:     Object.fromEntries(typeRes.records.map(r => [r.get("type"), r.get("c").toNumber()])),
        byRelation: Object.fromEntries(relRes.records.map(r => [r.get("rel"), r.get("c").toNumber()])),
      };
    } finally {
      await session.close();
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Singleton factory — picks backend from env
// ══════════════════════════════════════════════════════════════════════════════

let _instance: IGraphBackend | null = null;

export function getGraphService(): IGraphBackend {
  if (_instance) return _instance;

  const neo4jUri  = process.env.NEO4J_URI;
  const neo4jUser = process.env.NEO4J_USER ?? "neo4j";
  const neo4jPass = process.env.NEO4J_PASSWORD ?? "";

  if (neo4jUri) {
    console.log("[graphService] Using Neo4j backend →", neo4jUri);
    _instance = new Neo4jGraphBackend(neo4jUri, neo4jUser, neo4jPass);
  } else {
    console.log("[graphService] Using PostgreSQL graph backend");
    _instance = new PostgresGraphBackend();
  }

  return _instance;
}

// ── Convenience re-exports (call without instantiating service manually) ──────

export const upsertNode    = (n: GraphNode)    => getGraphService().upsertNode(n);
export const upsertEdge    = (e: GraphEdge)    => getGraphService().upsertEdge(e);
export const getNode       = (id: string)      => getGraphService().getNode(id);
export const getNeighbors  = (id: string, rel?: GraphRelation, dir?: "in"|"out"|"both") =>
  getGraphService().getNeighbors(id, rel, dir);
export const getShortestPath        = (a: string, b: string) => getGraphService().getShortestPath(a, b);
export const getAlternativeSuppliers = (id: string, limit?: number) =>
  getGraphService().getAlternativeSuppliers(id, limit);
export const getCommonBuyers        = (s1: string, s2: string) => getGraphService().getCommonBuyers(s1, s2);
export const getSupplyChain         = (productId: string, depth?: number) =>
  getGraphService().getSupplyChain(productId, depth);
export const getTopCentralNodes     = (type?: NodeType, limit?: number) =>
  getGraphService().getTopCentralNodes(type, limit);
