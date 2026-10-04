/** Contact form shape and validation, shared by the browser (instant feedback) and the server action (authoritative). */

export const contactFields = ["name", "phone", "email", "subject", "message"] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactFormState = {
  status: "idle" | "invalid" | "success" | "error";
  /** Submitted values, returned so fields keep their content after an unsuccessful attempt. */
  values: ContactValues;
  errors: ContactErrors;
  message?: string;
};

export const emptyContactValues: ContactValues = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

export const initialContactState: ContactFormState = {
  status: "idle",
  values: emptyContactValues,
  errors: {},
};

/** Honeypot field name. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "website";

export const contactLimits = {
  name: 120,
  phone: 30,
  email: 254,
  subject: 150,
  messageMin: 10,
  message: 5000,
} as const;

export function readContactForm(formData: FormData): ContactValues {
  const read = (field: ContactField) => {
    const value = formData.get(field);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    subject: read("subject"),
    message: read("message"),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\-.\s\d]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > contactLimits.name) errors.name = "Please shorten your name.";

  if (values.phone) {
    const digits = values.phone.replace(/\D/g, "").length;
    if (!PHONE_PATTERN.test(values.phone) || digits < 7 || values.phone.length > contactLimits.phone) {
      errors.phone = "Please enter a valid phone number, or leave this field empty.";
    }
  }

  if (!values.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email) || values.email.length > contactLimits.email) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }

  if (values.subject.length > contactLimits.subject) {
    errors.subject = `Please keep the subject under ${contactLimits.subject} characters.`;
  }

  if (!values.message) errors.message = "Please enter a message.";
  else if (values.message.length < contactLimits.messageMin) {
    errors.message = "Please add a little more detail to your message.";
  } else if (values.message.length > contactLimits.message) {
    errors.message = `Please keep your message under ${contactLimits.message} characters.`;
  }

  return errors;
}
