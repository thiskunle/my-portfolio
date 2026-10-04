import "server-only";
import type { ContactValues } from "@/lib/contact/validation";

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/**
 * Sends a validated contact message. Server-only: never import this from client code.
 *
 * No provider is connected yet, so this reports "not-configured" and the form tells the visitor
 * to use email or phone instead. To go live, implement the provider call here (e.g. an email
 * API or SMTP relay) using credentials from server-side environment variables, and return
 * { ok: true } on success. The form and server action need no changes.
 */
export async function deliverContactMessage(message: ContactValues): Promise<DeliveryResult> {
  void message;
  return { ok: false, reason: "not-configured" };
}
