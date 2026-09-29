/**
 * localStorage helpers — the token and in-progress draft never leave the
 * browser. Every access is wrapped in try/catch (private browsing, blocked
 * storage, quota errors, etc. must never crash the app).
 */
import type { CollectionKey } from '@/lib/schemas';
import type { AdminFormState } from './formData';

const TOKEN_KEY = 'xomnibot-admin-token';
const DRAFT_KEY = 'xomnibot-admin-draft';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore — the session still works, just won't persist across reloads
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export interface DraftPayload {
  collection: CollectionKey;
  format: 'md' | 'mdx';
  body: string;
  form: AdminFormState;
  savedAt: number;
}

export function saveDraft(payload: DraftPayload): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // ignore — autosave is best-effort
  }
}

export function loadDraft(): DraftPayload | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftPayload;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
