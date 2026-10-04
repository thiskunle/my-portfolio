"use server";

import { contact } from "@/lib/content";
import { deliverContactMessage } from "@/lib/contact/delivery";
import {
  emptyContactValues,
  HONEYPOT_FIELD,
  readContactForm,
  validateContact,
  type ContactFormState,
} from "@/lib/contact/validation";

/**
 * Contact form server action. Re-validates everything on the server, then hands off to the
 * delivery adapter. Spam submissions (honeypot filled) get a silent success.
 *
 * Before production: add rate limiting (per IP) alongside connecting a delivery provider.
 */
export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get(HONEYPOT_FIELD)) {
    return { status: "success", values: emptyContactValues, errors: {} };
  }

  const values = readContactForm(formData);
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", values, errors };
  }

  const result = await deliverContactMessage(values);
  if (!result.ok) {
    return {
      status: "error",
      values,
      errors: {},
      message:
        result.reason === "not-configured"
          ? `Online messages aren’t available yet. Please email ${contact.email} or call ${contact.phone.display}.`
          : `Your message couldn’t be sent. Please try again, or email ${contact.email}.`,
    };
  }

  return { status: "success", values: emptyContactValues, errors: {} };
}
