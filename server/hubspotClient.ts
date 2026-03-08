/**
 * HubSpot CRM client — create/update contacts via the v3 Contacts API.
 *
 * Required env var:
 *   HUBSPOT_API_KEY  — Private App access token (Settings → Integrations → Private Apps)
 *                      Needs scopes: crm.objects.contacts.write, crm.objects.contacts.read
 */

const HUBSPOT_API_BASE = "https://api.hubapi.com";

function getToken(): string | null {
  return process.env.HUBSPOT_API_KEY ?? null;
}

/**
 * Upsert a contact by email.
 * Uses the v3 upsert endpoint so re-subscribing the same email is idempotent.
 * Returns the HubSpot contact ID on success, null if unconfigured, throws on API error.
 */
export async function upsertHubSpotContact(
  email: string,
  extra: { firstName?: string; lastName?: string; source?: string } = {}
): Promise<string | null> {
  const token = getToken();
  if (!token) {
    console.log("[hubspot] HUBSPOT_API_KEY not set — skipping CRM sync");
    return null;
  }

  const properties: Record<string, string> = { email };
  if (extra.firstName) properties.firstname = extra.firstName;
  if (extra.lastName) properties.lastname = extra.lastName;
  if (extra.source) properties.hs_lead_status = "NEW";

  // POST /crm/v3/objects/contacts — creates or returns existing (409 = already exists)
  const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (res.status === 409) {
    // Contact already exists — update their properties
    const conflict = await res.json() as { message?: string };
    const match = conflict.message?.match(/existing ID: (\d+)/);
    const existingId = match?.[1];
    if (existingId) {
      await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existingId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      });
      return existingId;
    }
    return null;
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot API ${res.status}: ${body}`);
  }

  const data = await res.json() as { id: string };
  return data.id;
}
