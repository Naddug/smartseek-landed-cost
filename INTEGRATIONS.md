# SmartSeek Integrations – OAuth Setup

SmartSeek supports **real OAuth 2.0** connections to major procurement and ERP platforms. Configure these environment variables to enable live integrations.

**→ Platform owner? See [PLATFORM_OWNER_CHECKLIST.md](./PLATFORM_OWNER_CHECKLIST.md) for step-by-step setup.**

## Quick Start: Google (Works in 5 Minutes)

Google Workspace is **free** to set up and works immediately:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create a project (or select existing) → Create Credentials → OAuth client ID
3. Application type: **Web application**
4. Authorized redirect URIs: `https://your-railway-domain.up.railway.app/api/integrations/oauth/callback`
5. Copy Client ID and Client Secret → Add to Railway env vars:
   - `INTEGRATION_GOOGLE_CLIENT_ID`
   - `INTEGRATION_GOOGLE_CLIENT_SECRET`
6. Restart. Signed-in users can now click **Connect** on Google Workspace.

## Supported Platforms

| Platform | OAuth Docs | Env Variables |
|----------|------------|---------------|
| **Google Workspace** | [Google Cloud Console](https://console.cloud.google.com/) (free) | `INTEGRATION_GOOGLE_CLIENT_ID`, `INTEGRATION_GOOGLE_CLIENT_SECRET` |
| **SAP Ariba** | [SAP Ariba Developer](https://developer.ariba.com/) | `INTEGRATION_SAP_ARIBA_CLIENT_ID`, `INTEGRATION_SAP_ARIBA_CLIENT_SECRET` |
| **Oracle** | [Oracle Cloud OAuth](https://docs.oracle.com/en/cloud/saas/applications-common/20b/oagrm/implementing-oauth2.html) | `INTEGRATION_ORACLE_CLIENT_ID`, `INTEGRATION_ORACLE_CLIENT_SECRET` |
| **Salesforce** | [Salesforce Connected Apps](https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm) | `INTEGRATION_SALESFORCE_CLIENT_ID`, `INTEGRATION_SALESFORCE_CLIENT_SECRET` |
| **Microsoft Dynamics** | [Azure App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) | `INTEGRATION_MICROSOFT_CLIENT_ID`, `INTEGRATION_MICROSOFT_CLIENT_SECRET` |
| **Coupa** | [Coupa API](https://developer.coupa.com/) | `INTEGRATION_COUPA_CLIENT_ID`, `INTEGRATION_COUPA_CLIENT_SECRET` |
| **Jaggaer** | [Jaggaer API](https://www.jaggaer.com/) | `INTEGRATION_JAGGAER_CLIENT_ID`, `INTEGRATION_JAGGAER_CLIENT_SECRET` |

## Setup

1. **Register an app** with each provider (see links above).
2. **Set redirect URI** in the provider console:
   ```
   https://your-domain.com/api/integrations/oauth/callback
   ```
   For local dev:
   ```
   http://localhost:5000/api/integrations/oauth/callback
   ```
3. **Add to `.env`**:
   ```env
   INTEGRATION_SAP_ARIBA_CLIENT_ID=your_client_id
   INTEGRATION_SAP_ARIBA_CLIENT_SECRET=your_client_secret
   INTEGRATION_ORACLE_CLIENT_ID=...
   INTEGRATION_ORACLE_CLIENT_SECRET=...
   # ... etc for each provider
   INTEGRATION_REDIRECT_URI=/api/integrations/oauth/callback
   ```
4. Restart the server. The Connect button will become active for configured providers.

## How It Works

- **OAuth 2.0** – No passwords stored; tokens stored encrypted.
- **Scopes** – Each provider uses its standard scopes (e.g. `api`, `refresh_token`).
- **Sync** – User authorizes once; SmartSeek syncs suppliers, RFQs, and landed cost data via API.

## Security

- Tokens stored in `UserIntegration` table; never logged.
- SOC 2 aligned; encryption in transit.
- Users can disconnect at any time from `/integrations`.
