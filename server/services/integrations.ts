/**
 * Integrations service - OAuth 2.0 flows for SAP Ariba, Oracle, Salesforce, etc.
 * Configure via env: INTEGRATION_{PROVIDER}_CLIENT_ID, INTEGRATION_{PROVIDER}_CLIENT_SECRET
 */

import { prisma } from "../../lib/prisma";
import crypto from "crypto";

export const INTEGRATION_PROVIDERS = [
  "sap_ariba",
  "oracle",
  "salesforce",
  "microsoft_dynamics",
  "coupa",
  "jaggaer",
] as const;

export const SLUG_TO_PROVIDER: Record<string, IntegrationProvider> = {
  sap: "sap_ariba",
  oracle: "oracle",
  salesforce: "salesforce",
  microsoft: "microsoft_dynamics",
  coupa: "coupa",
  jaggaer: "jaggaer",
};

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

interface OAuthConfig {
  authUrl: string;
  tokenUrl: string;
  scope: string;
  clientIdEnv: string;
  clientSecretEnv: string;
}

const OAUTH_CONFIGS: Record<IntegrationProvider, OAuthConfig> = {
  sap_ariba: {
    authUrl: "https://auth.ariba.com/oauth/authorize",
    tokenUrl: "https://auth.ariba.com/oauth/token",
    scope: "api",
    clientIdEnv: "INTEGRATION_SAP_ARIBA_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_SAP_ARIBA_CLIENT_SECRET",
  },
  oracle: {
    authUrl: "https://login.oraclecloud.com/oauth2/v1/authorize",
    tokenUrl: "https://login.oraclecloud.com/oauth2/v1/token",
    scope: "urn:opc:resource:consumer::all",
    clientIdEnv: "INTEGRATION_ORACLE_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_ORACLE_CLIENT_SECRET",
  },
  salesforce: {
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    tokenUrl: "https://login.salesforce.com/services/oauth2/token",
    scope: "api refresh_token",
    clientIdEnv: "INTEGRATION_SALESFORCE_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_SALESFORCE_CLIENT_SECRET",
  },
  microsoft_dynamics: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scope: "https://dynamics.microsoft.com/.default offline_access",
    clientIdEnv: "INTEGRATION_MICROSOFT_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_MICROSOFT_CLIENT_SECRET",
  },
  coupa: {
    authUrl: "https://api.coupa.com/oauth/authorize",
    tokenUrl: "https://api.coupa.com/oauth/token",
    scope: "read write",
    clientIdEnv: "INTEGRATION_COUPA_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_COUPA_CLIENT_SECRET",
  },
  jaggaer: {
    authUrl: "https://api.jaggaer.com/oauth/authorize",
    tokenUrl: "https://api.jaggaer.com/oauth/token",
    scope: "api",
    clientIdEnv: "INTEGRATION_JAGGAER_CLIENT_ID",
    clientSecretEnv: "INTEGRATION_JAGGAER_CLIENT_SECRET",
  },
};

const REDIRECT_URI_BASE = process.env.INTEGRATION_REDIRECT_URI || "/api/integrations/oauth/callback";

function getClientCredentials(provider: IntegrationProvider): { clientId: string; clientSecret: string } | null {
  const config = OAUTH_CONFIGS[provider];
  const clientId = process.env[config.clientIdEnv];
  const clientSecret = process.env[config.clientSecretEnv];
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isProviderConfigured(provider: IntegrationProvider): boolean {
  return getClientCredentials(provider) !== null;
}

export async function getAuthorizationUrl(
  provider: IntegrationProvider,
  userId: string,
  baseUrl: string
): Promise<{ url: string; state: string } | { error: string }> {
  const creds = getClientCredentials(provider);
  if (!creds) {
    return { error: `Integration ${provider} is not configured. Contact support to enable.` };
  }

  const config = OAUTH_CONFIGS[provider];
  const state = crypto.randomBytes(24).toString("hex");
  const redirectUri = `${baseUrl.replace(/\/$/, "")}${REDIRECT_URI_BASE}`;

  // Store state for callback verification (provider stored for lookup)
  await prisma.integrationOAuthState.create({
    data: {
      state,
      userId,
      provider,
      redirectUri,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    },
  });

  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scope,
    state,
  });

  return { url: `${config.authUrl}?${params.toString()}`, state };
}

export async function exchangeCodeForTokens(
  provider: IntegrationProvider,
  code: string,
  state: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const creds = getClientCredentials(provider);
  if (!creds) {
    return { success: false, error: "Integration not configured" };
  }

  const stateRecord = await prisma.integrationOAuthState.findUnique({
    where: { state },
  });

  if (!stateRecord || stateRecord.provider !== provider) {
    return { success: false, error: "Invalid state parameter" };
  }

  if (new Date() > stateRecord.expiresAt) {
    await prisma.integrationOAuthState.delete({ where: { state } });
    return { success: false, error: "State expired" };
  }

  const userId = stateRecord.userId;
  const redirectUri = stateRecord.redirectUri;
  await prisma.integrationOAuthState.delete({ where: { state } });

  const config = OAUTH_CONFIGS[provider];

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri || "",
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
  });

  try {
    const res = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err || "Token exchange failed" };
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : null;

    await prisma.userIntegration.upsert({
      where: { userId_provider: { userId, provider } },
      create: {
        userId,
        provider,
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresAt,
        status: "active",
        metadata: {},
      },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresAt,
        status: "active",
        lastSyncAt: new Date(),
        metadata: {},
      },
    });

    return { success: true, userId };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function getUserIntegrations(userId: string) {
  const integrations = await prisma.userIntegration.findMany({
    where: { userId },
    select: {
      id: true,
      provider: true,
      status: true,
      lastSyncAt: true,
      createdAt: true,
    },
  });

  return INTEGRATION_PROVIDERS.map((provider) => {
    const conn = integrations.find((conn: { provider: string }) => conn.provider === provider);
    return {
      provider,
      name: provider.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      connected: !!conn && conn.status === "active",
      lastSyncAt: conn?.lastSyncAt,
      configured: isProviderConfigured(provider),
    };
  });
}

export async function disconnectIntegration(userId: string, provider: IntegrationProvider) {
  await prisma.userIntegration.deleteMany({
    where: { userId, provider },
  });
}
