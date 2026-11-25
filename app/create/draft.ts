import type { CvForm } from "@/lib/cv/types";

/** The in-progress CV, kept on this device so a closed tab never costs anyone their work. */
export type Draft = {
  form: CvForm;
  step: number;
  cvId: string | null;
  /** Set when the visitor was sent to sign in right before writing. */
  pending: boolean;
  /** Filled from an uploaded CV and not reviewed yet. */
  review?: boolean;
};

const DRAFT_KEY = "cvfy:draft:v2";

export function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft?.form?.v === 2 ? draft : null;
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft | null) {
  try {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Private mode or full storage: the form still works, it just won't survive a reload.
  }
}
