/** Small, dependency-free helpers shared across the site. */

type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean | undefined | null>;

/** Joins conditional class names. Accepts strings, arrays, and `{ class: bool }` maps. */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  const process = (input: ClassValue) => {
    if (!input) return;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
      return;
    }
    if (Array.isArray(input)) {
      input.forEach(process);
      return;
    }
    if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  };
  inputs.forEach(process);
  return classes.join(' ');
}

/** Formats a date as "Aug 5, 2026" (or custom Intl options). */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(
    'en-US',
    options ?? { year: 'numeric', month: 'short', day: 'numeric' },
  ).format(d);
}

/** Formats a date as an ISO 8601 string (for <time datetime="">, RSS, JSON-LD). */
export function formatIsoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/** kebab-cases a string: "AS-REP Roasting" -> "as-rep-roasting". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Strips common Markdown/MDX syntax down to plain text.
 * Intentionally approximate (no AST) — used for reading time and for
 * deriving a fallback description from the first paragraph of a post.
 */
export function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>+\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~#>`]/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Computes "N min read" from a Markdown/MDX body at ~220 words per minute. */
export function readingTime(body: string, wordsPerMinute = 220): string {
  const plain = stripMarkdown(body ?? '');
  const words = plain.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min read`;
}
