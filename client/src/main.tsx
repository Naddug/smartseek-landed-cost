import React from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(<App />);
