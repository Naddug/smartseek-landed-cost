# OAuth Provider Setup

Facebook, LinkedIn, and Apple sign-in require credentials to be configured in your Railway (or production) environment. Without them, those buttons show "Coming soon."

## Enable Each Provider

Add these environment variables in Railway → your project → Variables:

### Google (usually works first)
- `GOOGLE_CLIENT_ID` – from [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET`
- Redirect URI: `{OAUTH_CALLBACK_BASE}/api/auth/google/callback`

### Facebook
- `FACEBOOK_APP_ID` – from [Facebook Developers](https://developers.facebook.com) → Create App → Facebook Login
- `FACEBOOK_APP_SECRET`
- Valid OAuth Redirect URI: `{OAUTH_CALLBACK_BASE}/api/auth/facebook/callback`

### LinkedIn
- `LINKEDIN_CLIENT_ID` – from [LinkedIn Developers](https://www.linkedin.com/developers/apps)
- `LINKEDIN_CLIENT_SECRET`
- Authorized redirect URL: `{OAUTH_CALLBACK_BASE}/api/auth/linkedin/callback`

### Apple
- `APPLE_CLIENT_ID` – your app's Services ID (e.g. `com.smartseek.app`)
- `APPLE_TEAM_ID`
- `APPLE_KEY_ID`
- `APPLE_PRIVATE_KEY` – contents of the .p8 key file
- Return URL: `{OAUTH_CALLBACK_BASE}/api/auth/apple/callback`

### Required for all OAuth
- `OAUTH_CALLBACK_BASE` – your production URL, e.g. `https://smartseek-landed-cost-production.up.railway.app`
- `SESSION_SECRET` – random 32+ character string

After adding credentials, redeploy. Each provider activates only when its env vars are present.
