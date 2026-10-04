// Lets other sections (e.g. Services) pre-fill the contact form's subject.
export const CONTACT_PREFILL_EVENT = 'contact:prefill'

export type ContactPrefillDetail = { subject: string }

export function requestContactPrefill(subject: string) {
  window.dispatchEvent(new CustomEvent<ContactPrefillDetail>(CONTACT_PREFILL_EVENT, { detail: { subject } }))
}
