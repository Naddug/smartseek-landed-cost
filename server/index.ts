// Allow self-signed certs for Railway Postgres (local dev connecting to cloud DB)
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupAuth } from "./auth";
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";

// stripe-replit-sync removed â Replit-specific package, incompatible with Railway.
// Stripe schema is managed via drizzle migrations.

const app = express();

/** Ensure required tables exist on Railway deploy. */
async function runDrizzlePush() {
  const url = process.env.DATABASE_URL;
  const onRailway = !!process.env.RAILWAY_ENVIRONMENT_ID || !!process.env.RAILWAY_ENVIRONMENT_NAME;
  if (!url || process.env.NODE_ENV !== "production") return;
  if (url.includes("localhost") || url.includes("dummy")) return;
  if (!onRailway) return;
  // ensureReportsTable called exactly once here
  await ensureReportsTable();
}

/** Create reports table if missing (fallback when drizzle-kit push fails) */
async function ensureReportsTable() {
  try {
    const { pool } = await import("./db");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        status VARCHAR DEFAULT 'completed' NOT NULL,
        form_data JSONB NOT NULL,
        report_data JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("Reports table ensured");
  } catch (e) {
    console.warn("ensureReportsTable failed:", (e as Error)?.message ?? e);
  }
}

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Initialize Stripe sync (no runMigrations â handled by drizzle)
async function initStripe() {
  if (process.env.STRIPE_SKIP_INIT === 'true') {
    console.log('STRIPE_SKIP_INIT set, skipping Stripe initialization');
    return;
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping Stripe initialization');
    return;
  }
  if (databaseUrl.includes('localhost:5432/dummy') || databaseUrl.startsWith('file:')) {
    console.log('Using local/dummy database, skipping Stripe initialization');
    return;
  }

  try {
    const stripeSync = await getStripeSync();
    console.log('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => console.log('Stripe data synced'))
      .catch((err: any) => console.error('Error syncing Stripe data:', err));
  } catch (error: any) {
    console.error('Failed to initialize Stripe (server will continue):', error);
  }
}

// Register Stripe webhook route BEFORE express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

// JSON middleware for all other routes (15mb for image uploads)
app.use(
  express.json({
    limit: '15mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '15mb' }));

// Security headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// Rate limiting â mounted at /api so req.path is relative (no /api prefix)
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      const path = req.path;
      return (
        path.startsWith("/auth") ||
        path === "/health" ||
        path === "/stripe/webhook"
      );
    },
  })
);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  await runDrizzlePush();
  await initStripe();

  await setupAuth(app);
  await registerRoutes(httpServer, app);

  // Error handler â do NOT re-throw; throwing inside Express error middleware
  // causes unhandled rejection and crashes the process.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (status >= 500) {
      console.error("[error]", err);
    }
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
