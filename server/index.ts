import "dotenv/config";
import { execSync } from "child_process";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupAuth } from "./auth";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";

const app = express();

/** Run Drizzle schema push on Railway deploy — fixes ECONNRESET (migrations run from Railway, not local) */
async function runDrizzlePush() {
  const url = process.env.DATABASE_URL;
  const onRailway = !!process.env.RAILWAY_ENVIRONMENT_ID || !!process.env.RAILWAY_ENVIRONMENT_NAME;
  if (!url || process.env.NODE_ENV !== "production") return;
  if (url.includes("localhost") || url.includes("dummy")) return;
  if (!onRailway) return; // Skip when running locally (avoids blocking on Railway DB from local)
  try {
    execSync("npx drizzle-kit push --force", {
      stdio: "inherit",
      env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: "0" },
    });
    console.log("Drizzle schema push completed");
  } catch (e) {
    console.warn("Drizzle push failed (non-fatal):", (e as Error)?.message ?? e);
  }
}
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Initialize Stripe schema and sync data
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
  // Skip if using dummy/local SQLite (Prisma) — Stripe needs PostgreSQL
  if (databaseUrl.includes('localhost:5432/dummy') || databaseUrl.startsWith('file:')) {
    console.log('Using local/dummy database, skipping Stripe initialization');
    return;
  }

  const doInit = async () => {
    console.log('Initializing Stripe schema...');
    // @ts-ignore - schema option is supported by stripe-replit-sync
    await runMigrations({ databaseUrl, schema: 'stripe' } as any);
  };

  try {
    await doInit();
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    if (webhookBaseUrl && webhookBaseUrl !== 'https://undefined') {
      try {
        const result = await stripeSync.findOrCreateManagedWebhook(
          `${webhookBaseUrl}/api/stripe/webhook`
        );
        if (result?.webhook?.url) {
          console.log(`Webhook configured: ${result.webhook.url}`);
        } else {
          console.log('Webhook setup returned no URL - may already exist');
        }
      } catch (webhookError) {
        console.log('Webhook setup skipped or already exists:', webhookError);
      }
    } else {
      console.log('Skipping webhook setup - no domain configured');
    }

    console.log('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => console.log('Stripe data synced'))
      .catch((err: any) => console.error('Error syncing Stripe data:', err));
  } catch (error: any) {
    if (error?.code === 'ECONNRESET' || error?.message?.includes('ECONNRESET')) {
      console.log('Stripe init ECONNRESET, retrying in 5s...');
      await new Promise((r) => setTimeout(r, 5000));
      try {
        await doInit();
        console.log('Stripe schema ready (retry succeeded)');
        return;
      } catch (retryErr) {
        console.error('Stripe init retry failed (server will continue):', retryErr);
      }
    } else {
      console.error('Failed to initialize Stripe (server will continue):', error);
    }
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

// Now apply JSON middleware for all other routes
// Increased limit to 15mb to support image uploads (base64 encoding adds ~33% overhead)
app.use(
  express.json({
    limit: '15mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '15mb' }));

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
  // Run Drizzle migrations on Railway (fixes ECONNRESET — runs from Railway network)
  await runDrizzlePush();
  // Initialize Stripe on startup
  await initStripe();
  
  await setupAuth(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Serve on PORT env or 3000 (avoids macOS AirPlay on 5000)
  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
