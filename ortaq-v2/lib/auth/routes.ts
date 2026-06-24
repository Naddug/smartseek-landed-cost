const DEFAULT_POST_AUTH = "/panel";

export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_POST_AUTH;
  }
  return next;
}

export function loginHref(next?: string): string {
  const path = next ? sanitizeNextPath(next) : undefined;
  if (!path || path === DEFAULT_POST_AUTH) return "/giris";
  return `/giris?next=${encodeURIComponent(path)}`;
}

export function registerPathChoiceHref(next?: string): string {
  if (!next) return "/kayit/yol-secimi";
  return `/kayit/yol-secimi?next=${encodeURIComponent(sanitizeNextPath(next))}`;
}

export function registerHref(role?: string, next?: string): string {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (next) params.set("next", sanitizeNextPath(next));
  const query = params.toString();
  return query ? `/kayit?${query}` : "/kayit";
}

export function authContinueHref(next?: string | null): string {
  if (!next) return "/auth/devam";
  return `/auth/devam?next=${encodeURIComponent(sanitizeNextPath(next))}`;
}

export function createDossierEntryHref(isAuthenticated: boolean): string {
  if (isAuthenticated) return "/panel/dosya-olustur";
  return registerPathChoiceHref("/panel/dosya-olustur");
}

export function partnerApplyLoginHref(dossierSlug: string): string {
  const returnPath = `/firsatlar/${dossierSlug}?intent=apply`;
  return loginHref(returnPath);
}

export function onboardingPathForRole(role: string): string {
  return role === "opportunity_owner"
    ? "/onboarding/firsat-sahibi"
    : "/onboarding/ortak";
}

export function postAuthRedirect(role: string, next?: string | null): string {
  if (next) return sanitizeNextPath(next);
  return onboardingPathForRole(role);
}
