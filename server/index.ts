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
import { verifySmtpConnection } from "./sendgridClient";
import { WebhookHandlers } from "./webhookHandlers";

// stripe-replit-sync removed Ã¢ÂÂ Replit-specific package, incompatible with Railway.
// Stripe schema is managed via drizzle migrations.

const app = express();

/** Ensure required tables exist on deploy. Runs for production with real DB (Railway or other cloud). */
async function runDrizzlePush() {
  const url = process.env.DATABASE_URL;
  const isProd = process.env.NODE_ENV === "production";
  const isRealDb = url && !url.includes("localhost") && !url.includes("dummy") && !url.startsWith("file:");
  if (!url || !isProd || !isRealDb) return;
  await ensureReportsTable();
  await ensureOAuthColumns();
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

/** Ensure users table has OAuth columns (for Google, Facebook, LinkedIn, Apple sign-in) */
async function ensureOAuthColumns() {
  try {
    const { pool } = await import("./db");
    const columns = ["google_id", "facebook_id", "linkedin_id", "apple_id"];
    for (const col of columns) {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col} VARCHAR(255) UNIQUE`);
    }
    console.log("OAuth columns ensured");
  } catch (e) {
    console.warn("ensureOAuthColumns failed:", (e as Error)?.message ?? e);
  }
}
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Initialize Stripe sync (no runMigrations Ã¢ÂÂ handled by drizzle)
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

  const doInit = async () => {
    let runMigrations: (opts: any) => Promise<void>;
    try {
      // @ts-expect-error - stripe-replit-sync is optional; may not have types
      const mod = await import('stripe-replit-sync');
      runMigrations = mod.runMigrations;
    } catch (err) {
      console.warn('stripe-replit-sync not available, skipping Stripe schema init:', (err as Error)?.message);
      return;
    }
    console.log('Initializing Stripe schema...');
    // @ts-ignore - schema option is supported by stripe-replit-sync
    await runMigrations({ databaseUrl, schema: 'stripe' } as any);
  };

  try {
    await doInit();
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();
    if (!stripeSync) {
      console.log('Stripe sync not available (stripe-replit-sync not loaded)');
      return;
    }

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

// Strict rate limiting for auth endpoints — prevent brute-force attacks
// Applied BEFORE the general limiter so it hits first
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 login attempts per IP per window
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // don't count successful logins
  })
);
app.use(
  "/api/auth/signup",
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,                    // 5 signups per IP per hour
    message: { error: "Too many account creation attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(
  "/api/auth/forgot-password",
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,                    // 5 reset requests per IP per hour
    message: { error: "Too many password reset requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// General rate limiting — 100 req/15min per IP for all other API routes
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
      // Skip health and webhooks; auth paths now have their own limiters above
      return path === "/health" || path === "/stripe/webhook";
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
  verifySmtpConnection(); // non-blocking — logs OK or warning

  await setupAuth(app);
  await registerRoutes(httpServer, app);

  // Error handler Ã¢ÂÂ do NOT re-throw; throwing inside Express error middleware
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
