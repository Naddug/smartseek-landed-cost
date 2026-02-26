# Platform Owner Checklist – Make Integrations Work

As platform owner, complete these steps to enable integrations for your users.

---

## 1. Google Workspace (≈5 min, free)

### Important: Railway domains are rejected by Google

Google OAuth **does not accept** `*.up.railway.app` redirect URIs. You will see errors like:
- "Invalid Origin: must end with a public top-level domain (such as .com or .org)"
- "URIs must not contain a path or end with '/'" (when used in wrong field)

**Use one of these instead:**
- **Custom domain** (recommended): Add a domain like `app.yourdomain.com` in Railway → Settings → Domains
- **Localhost** (for local testing only): `http://localhost:5000/api/integrations/oauth/callback`

### Step 1: Create OAuth credentials

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. Create a project: **Select a project** → **New Project** → name it (e.g. "SmartSeek")
3. **APIs & Services** → **OAuth consent screen**
   - User type: **External** (or Internal if Google Workspace only)
   - App name: `SmartSeek`
   - User support email: your email
   - Developer contact: your email
   - **Authorized domains** → Add your domain (e.g. `yourdomain.com`). Required before redirect URIs work.
   - **Save and Continue** through scopes (default is fine)
   - Add yourself as a test user if External
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `SmartSeek Integrations`
   - **Authorized JavaScript origins** (if using client-side): `https://yourdomain.com` (no trailing slash, no path)
   - **Authorized redirect URIs** → **Add URI**:
     ```
     https://app.yourdomain.com/api/integrations/oauth/callback
     ```
     Or for local testing:
     ```
     http://localhost:5000/api/integrations/oauth/callback
     ```
     ⚠️ Do **not** use `*.up.railway.app` — Google rejects it.
   - **Create** → copy **Client ID** and **Client Secret**

### Step 2: Add to Railway

1. Railway Dashboard → your project → **Variables**
2. Add:
   - `INTEGRATION_GOOGLE_CLIENT_ID` = (paste Client ID)
   - `INTEGRATION_GOOGLE_CLIENT_SECRET` = (paste Client Secret)
   - `PUBLIC_APP_URL` = `https://app.smartseek.com` (or your custom domain — no trailing slash)
3. Redeploy (or wait for auto-deploy)

`PUBLIC_APP_URL` ensures the OAuth redirect URI is always correct (fixes `redirect_uri_mismatch`).

### Step 3: Verify

1. Sign in to your app
2. Go to **Integrations**
3. Click **Connect** on Google Workspace
4. Complete Google sign-in → you should see "Connected"

---

## 2. Add a Custom Domain (required for Google OAuth)

Google does not accept `*.up.railway.app`. Add a custom domain:

1. Railway Dashboard → your **Web Service** → **Settings** → **Domains**
2. Click **Add Domain** → enter `app.yourdomain.com` (or similar)
3. Follow Railway’s DNS instructions to verify ownership
4. Use that domain in Google Console: `https://app.yourdomain.com/api/integrations/oauth/callback`

For local testing only, use `http://localhost:5000/api/integrations/oauth/callback` — no custom domain needed.

---

## 3. Optional: Other Integrations (SAP, Oracle, Salesforce, etc.)

Each requires registering an app in the provider’s developer portal:

| Provider | Portal | Redirect URI |
|----------|--------|--------------|
| SAP Ariba | [developer.ariba.com](https://developer.ariba.com/) | `https://your-domain/api/integrations/oauth/callback` |
| Oracle | Oracle Cloud Console | Same |
| Salesforce | [developer.salesforce.com](https://developer.salesforce.com/) | Same |
| Microsoft Dynamics | [portal.azure.com](https://portal.azure.com/) → App registrations | Same |
| Coupa | [developer.coupa.com](https://developer.coupa.com/) | Same |
| Jaggaer | [jaggaer.com](https://www.jaggaer.com/) | Same |

Add the corresponding env vars (see `.env.example`).

---

## 4. Environment Variables Summary

```env
# Required for Google (works immediately)
INTEGRATION_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
INTEGRATION_GOOGLE_CLIENT_SECRET=GOCSPX-xxx
PUBLIC_APP_URL=https://app.smartseek.com

# Optional – override redirect path (default: /api/integrations/oauth/callback)
# The full redirect URI is built from your app’s URL + this path. Use a custom domain so the app URL is valid for Google.
# INTEGRATION_REDIRECT_URI=/api/integrations/oauth/callback
```

---

## 5. Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid URI" / "must end with public top-level domain" when adding redirect URI | Google rejects `*.up.railway.app`. Use a custom domain (e.g. `app.yourdomain.com`) or `http://localhost:5000` for testing. |
| "OAuth credentials required" | Env vars not set in Railway. Add them and redeploy. |
| "redirect_uri_mismatch" | Set `PUBLIC_APP_URL=https://app.smartseek.com` in Railway. Google Console redirect URI must exactly match `https://app.smartseek.com/api/integrations/oauth/callback` (no trailing slash). |
| "invalid_client" | Re-copy Client ID and Client Secret from Google Console. Ensure no extra spaces. Use the **Web application** OAuth client, not Android/iOS. |
| "invalid_state" | User took too long; try again. State expires in 10 min. |
| Connect button disabled | Provider not configured. Add env vars for that provider. |
