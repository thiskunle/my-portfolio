"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_FIELD_IDS, subscribeContactPrefill } from "@/lib/contact/prefill";
import {
  contactFields,
  contactLimits,
  HONEYPOT_FIELD,
  initialContactState,
  readContactForm,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact/validation";
import { cn } from "@/lib/cn";

const inputStyles =
  "w-full rounded-field border border-line bg-paper px-4 py-3.5 text-base text-ink transition-[border-color,box-shadow] duration-200 " +
  "focus:border-forest focus:ring-3 focus:ring-forest/20 focus:outline-none motion-reduce:transition-none " +
  "aria-invalid:border-danger aria-invalid:focus:ring-danger/20";

function focusFirstInvalid(found: ContactErrors) {
  const first = contactFields.find((field) => found[field]);
  if (first) document.getElementById(CONTACT_FIELD_IDS[first])?.focus();
}

type FieldProps = {
  field: ContactField;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: (props: {
    id: string;
    name: ContactField;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
};

function Field({ field, label, required, error, className, children }: FieldProps) {
  const id = CONTACT_FIELD_IDS[field];
  const errorId = `${id}-error`;
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="font-normal text-ink-2"> (required)</span> : null}
      </label>
      {children({
        id,
        name: field,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: inputStyles,
      })}
      {error ? (
        <p id={errorId} className="flex items-start gap-2 text-sm text-danger">
          <Icon name="x" className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Contact form. Validates in the browser for instant, accessible feedback, then submits to the
 * submitContact server action, which re-validates and hands off to the delivery adapter.
 * Subject can be pre-filled from project and pricing CTAs.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [subject, setSubject] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  // Adopt each new server result: its errors replace ours, and a success clears the subject.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    setErrors(state.errors);
    if (state.status === "success") setSubject("");
  }

  useEffect(
    () =>
      subscribeContactPrefill((value) => {
        setSubject(value);
        setErrors((current) => ({ ...current, subject: undefined }));
      }),
    [],
  );

  // Move focus to the outcome so it is announced and visible.
  useEffect(() => {
    if (state.status === "invalid") focusFirstInvalid(state.errors);
    else if (state.status === "success" || state.status === "error") statusRef.current?.focus();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateContact(readContactForm(new FormData(event.currentTarget)));
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setErrors(found);
      focusFirstInvalid(found);
    } else {
      setErrors({});
    }
  }

  function clearError(field: ContactField) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  const values = state.values;
  const errorCount = contactFields.filter((field) => errors[field]).length;

  return (
    <div className="rounded-panel bg-card p-6 ring-1 ring-line ring-inset sm:p-10">
      <h3 id="contact-form-title" className="text-h3">
        Send a message
      </h3>

      <div ref={statusRef} tabIndex={-1} className="outline-none">
        {state.status === "success" ? (
          <p role="status" className="mt-6 flex items-start gap-3 rounded-field bg-moss p-4 text-ink">
            <Icon name="check" className="mt-1 text-forest" />
            Thank you. Your message has been sent.
          </p>
        ) : null}
        {state.status === "error" && state.message ? (
          <p role="alert" className="mt-6 flex items-start gap-3 rounded-field border border-danger p-4 text-ink">
            <Icon name="x" className="mt-1 text-danger" />
            {state.message}
          </p>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {errorCount > 0 ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention.` : ""}
      </p>

      <form
        action={formAction}
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="contact-form-title"
        className="relative mt-8 grid gap-6 sm:grid-cols-2"
      >
        <Field field="name" label="Your name" required error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              autoComplete="name"
              required
              maxLength={contactLimits.name}
              defaultValue={values.name}
              onChange={() => clearError("name")}
            />
          )}
        </Field>

        <Field field="phone" label="Phone number" error={errors.phone}>
          {(props) => (
            <input
              {...props}
              type="tel"
              autoComplete="tel"
              maxLength={contactLimits.phone}
              defaultValue={values.phone}
              onChange={() => clearError("phone")}
            />
          )}
        </Field>

        <Field field="email" label="Email" required error={errors.email} className="sm:col-span-2">
          {(props) => (
            <input
              {...props}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={contactLimits.email}
              defaultValue={values.email}
              onChange={() => clearError("email")}
            />
          )}
        </Field>

        <Field field="subject" label="Subject" error={errors.subject} className="sm:col-span-2">
          {(props) => (
            <input
              {...props}
              type="text"
              maxLength={contactLimits.subject}
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                clearError("subject");
              }}
            />
          )}
        </Field>

        <Field field="message" label="Your message" required error={errors.message} className="sm:col-span-2">
          {(props) => (
            <textarea
              {...props}
              required
              rows={6}
              minLength={contactLimits.messageMin}
              maxLength={contactLimits.message}
              defaultValue={values.message}
              onChange={() => clearError("message")}
              className={cn(props.className, "min-h-40 resize-y")}
            />
          )}
        </Field>

        {/* Spam honeypot: hidden from people and assistive tech. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
          </Button>
          <p className="text-sm text-ink-2">Fields marked required must be filled in.</p>
        </div>
      </form>
    </div>
  );
}
