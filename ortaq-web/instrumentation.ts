/**
 * Next.js instrumentation — error monitoring hook.
 * Set SENTRY_DSN in Vercel when ready. No-op until then.
 */
export async function register() {
  if (process.env.SENTRY_DSN && process.env.NEXT_RUNTIME === "nodejs") {
    // Future: @sentry/nextjs init here after legal + ops sign-off
    // await import('@sentry/nextjs').then(Sentry => Sentry.init({ dsn: process.env.SENTRY_DSN }))
  }
}
