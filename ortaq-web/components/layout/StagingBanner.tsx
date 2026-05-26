import { env } from "@/lib/env";

/** Visible on staging / preview only — prevents mistaken QA on production URL. */
export function StagingBanner() {
  if (!env.isStaging) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-ortaq-gold/30 bg-ortaq-dark px-4 py-2 text-center text-[0.75rem] font-medium tracking-wide text-ortaq-cream/90"
    >
      <span className="text-ortaq-gold">STAGING</span>
      <span className="mx-2 text-ortaq-cream/40">·</span>
      {env.siteUrl.replace(/^https?:\/\//, "")} — mobil QA, performans ve SEO doğrulama ortamı. Üretim sitesi değildir.
    </div>
  );
}
