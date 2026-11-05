import type { ContactValues } from "@/lib/contact/validation";

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/**
 * Static Forms emails each submission to the address set on the form in its dashboard
 * (info@grambyte.ca). The site is a static export (GitHub Pages), so delivery happens from the
 * browser. The key is a public identifier by design: it cannot read submissions or sign in. Set
 * CONTACT_ENDPOINT to null to turn delivery off; the form then tells visitors to use email or phone.
 */
const CONTACT_ENDPOINT: string | null = "https://api.staticforms.dev/submit";
const CONTACT_API_KEY = "sf_020a7870806a6345818b65f1";

/** Sends a validated contact message to CONTACT_ENDPOINT. Runs in the browser. */
export async function deliverContactMessage(message: ContactValues): Promise<DeliveryResult> {
  if (!CONTACT_ENDPOINT) return { ok: false, reason: "not-configured" };

  // Optional fields left blank are dropped so they don't appear as empty rows in the email.
  const filled = Object.fromEntries(Object.entries(message).filter(([, value]) => value));

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...filled, apiKey: CONTACT_API_KEY }),
    });
    if (!response.ok) return { ok: false, reason: "failed" };
    const result: { success?: unknown } = await response.json();
    return result.success === true ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
