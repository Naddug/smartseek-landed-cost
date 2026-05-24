import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Loader2 } from "lucide-react";
import App from "./App";
import "./lib/i18n";
import "./index.css";
import { queryClient } from "./lib/queryClient";

/** Prevent back-button bypass: when page restored from bfcache on a protected route, force reload to re-verify auth */
const PROTECTED_PATHS = ['/app/dashboard', '/app/suppliers', '/app/smart-finder', '/app/ai-agent', '/app/find-leads', '/app/reports', '/app/tools', '/app/landed-cost', '/app/customs-calculator', '/app/shipping-estimator', '/app/trade-data', '/app/risk-intelligence', '/app/compliance', '/app/billing', '/app/admin'];
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (e: PageTransitionEvent) => {
    if (e.persisted) {
      const path = window.location.pathname;
      if (PROTECTED_PATHS.some(p => path === p || path.startsWith(p + "/"))) {
        window.location.reload();
        return;
      }
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["profile"] });
    }
  });
}

/**
 * i18n fallback rendered only if the inlined EN bundle plus the user's
 * locale fetch both fail to resolve synchronously. With EN inlined this should
 * essentially never appear, but Suspense requires a fallback element.
 */
function I18nFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<I18nFallback />}>
    <App />
  </Suspense>
);
