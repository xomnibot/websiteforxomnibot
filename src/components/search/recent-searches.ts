/** localStorage-backed recent search queries, capped at 5, most recent first. */

const STORAGE_KEY = 'xomnibot:recent-searches';
const MAX_ENTRIES = 5;

export function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string').slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return loadRecentSearches();
  try {
    const deduped = loadRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...deduped].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadRecentSearches();
  }
}

export function clearRecentSearches(): string[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore — private mode / storage disabled */
  }
  return [];
}
