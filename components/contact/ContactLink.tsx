"use client";

import type { ReactNode } from "react";
import { CONTACT_SECTION_ID, startContact } from "@/lib/contact/prefill";

type ContactLinkProps = {
  /** Pre-filled into the contact form's Subject field. */
  subject: string;
  className?: string;
  children: ReactNode;
};

/**
 * Link to the contact section that also pre-fills the subject. Closes an enclosing dialog first.
 * Without JavaScript it is a plain #contacts link.
 */
export function ContactLink({ subject, className, children }: ContactLinkProps) {
  return (
    <a
      href={`#${CONTACT_SECTION_ID}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.currentTarget.closest("dialog")?.close();
        startContact(subject);
      }}
    >
      {children}
    </a>
  );
}
