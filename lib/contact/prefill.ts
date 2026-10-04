/**
 * Browser-side bridge between "contact" CTAs (projects, pricing) and the contact form.
 * Only call these from Client Components / event handlers.
 */

export const CONTACT_SECTION_ID = "contacts";
export const CONTACT_FIELD_IDS = {
  name: "contact-name",
  phone: "contact-phone",
  email: "contact-email",
  subject: "contact-subject",
  message: "contact-message",
} as const;

type Listener = (subject: string) => void;
const listeners = new Set<Listener>();

export function subscribeContactPrefill(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Pre-fills the subject, scrolls to the contact section and focuses the first empty required field. */
export function startContact(subject: string) {
  listeners.forEach((listener) => listener(subject));

  const section = document.getElementById(CONTACT_SECTION_ID);
  if (!section) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${CONTACT_SECTION_ID}`);

  const required = [CONTACT_FIELD_IDS.name, CONTACT_FIELD_IDS.email, CONTACT_FIELD_IDS.message];
  const fields = required
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLInputElement | HTMLTextAreaElement => el !== null);
  const target = fields.find((field) => field.value.trim() === "") ?? fields.at(-1);
  target?.focus({ preventScroll: true });
}
