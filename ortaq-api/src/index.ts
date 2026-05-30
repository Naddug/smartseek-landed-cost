import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config, assertProductionSecrets } from "./config/env.js";
import { trustRouter } from "./routes/v1/trust.js";
import { campaignsRouter } from "./routes/v1/campaigns.js";
import { complaintsRouter } from "./routes/v1/complaints.js";
import { adminRouter } from "./routes/admin/index.js";

assertProductionSecrets();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin.split(",").map((s) => s.trim()),
    methods: ["GET", "POST", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "100kb" }));

app.use((_req, res, next) => {
  res.setHeader("X-ORTAQ-Service", "ortaq-api");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ortaq-api", env: config.env });
});

app.get("/ready", (_req, res) => {
  res.json({
    status: "ready",
    checks: {
      database: config.databaseUrl ? "configured" : "not_configured",
      trust_ops: "active",
    },
  });
});

app.use("/v1/trust", trustRouter);
app.use("/v1/campaigns", campaignsRouter);
app.use("/v1/complaints", complaintsRouter);
app.use("/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.listen(config.port, () => {
  console.log(`[ortaq-api] listening on :${config.port} (${config.env})`);
});
