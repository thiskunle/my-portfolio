import type { ContactValues } from "@/lib/contact/validation";

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/**
 * Public URL of an external form/email endpoint that accepts a JSON POST of ContactValues.
 * The site is a static export (GitHub Pages), so delivery happens from the browser: never put
 * credentials here. Leave null until an endpoint is chosen; the form then tells visitors to use
 * email or phone instead.
 */
const CONTACT_ENDPOINT: string | null = null;

/** Sends a validated contact message to CONTACT_ENDPOINT. Runs in the browser. */
export async function deliverContactMessage(message: ContactValues): Promise<DeliveryResult> {
  if (!CONTACT_ENDPOINT) return { ok: false, reason: "not-configured" };

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(message),
    });
    return response.ok ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
