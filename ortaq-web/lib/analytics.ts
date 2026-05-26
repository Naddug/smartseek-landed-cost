import { env } from "@/lib/env";

/**
 * Privacy-first analytics hook.
 * Default: disabled. No fake metrics, no investor counts.
 * Enable only with explicit env + legal review (KVKK).
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || !env.analytics.enabled) return;

  if (env.analytics.provider === "plausible" && env.analytics.domain) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = env.analytics.domain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }
}

export function trackPageView(_path: string): void {
  void _path;
  if (!env.analytics.enabled) return;
  // Plausible auto-tracks; custom events added when product needs them
}
