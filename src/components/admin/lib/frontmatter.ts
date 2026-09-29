/**
 * Frontmatter parse/dump + H1-title extraction for the /admin app.
 * Pure functions, no DOM/browser APIs — safe to unit test with plain node.
 */
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

export interface ParsedFrontmatter {
  data: Record<string, unknown>;
  body: string;
  hadFrontmatter: boolean;
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;

/** Splits a raw .md/.mdx file into parsed frontmatter data + remaining body. */
export function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = FM_RE.exec(raw);
  if (!match) {
    return { data: {}, body: raw, hadFrontmatter: false };
  }
  const yamlBlock = match[1];
  const body = raw.slice(match[0].length);
  let data: unknown;
  try {
    data = yamlLoad(yamlBlock);
  } catch {
    // Malformed YAML — treat as no frontmatter rather than throwing, the
    // caller surfaces this as a parse warning.
    return { data: {}, body: raw, hadFrontmatter: false };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    data = {};
  }
  return { data: data as Record<string, unknown>, body, hadFrontmatter: true };
}

/** Formats a Date (or date-ish string) as YYYY-MM-DD using its LOCAL calendar date. */
export function toDateOnly(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Recursively drops empty/undefined values so optional fields the owner
 * left blank don't clutter the written YAML. Keeps `false`/`0` (meaningful
 * values), drops `''`, `null`, `undefined`, `[]`, and `{}`.
 */
export function pruneEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    const arr = value.map(pruneEmpty).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const pruned = pruneEmpty(v);
      if (pruned !== undefined) out[k] = pruned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}

/** Dumps a frontmatter object as a `---\n...\n---\n` YAML block. Order is preserved as given. */
export function dumpFrontmatter(data: Record<string, unknown>): string {
  const pruned = (pruneEmpty(data) as Record<string, unknown>) ?? {};
  const yaml = yamlDump(pruned, {
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
    quoteStyle: 'double',
  });
  return `---\n${yaml}---\n`;
}

/** Joins a frontmatter object + body into a full file. */
export function serializePost(data: Record<string, unknown>, body: string): string {
  const trimmedBody = body.replace(/^\n+/, '');
  return `${dumpFrontmatter(data)}\n${trimmedBody.endsWith('\n') ? trimmedBody : trimmedBody + '\n'}`;
}

export interface H1Extraction {
  title: string | null;
  body: string;
}

/**
 * Finds the first ATX H1 (`# Title`) at the start of the body (allowing
 * leading blank lines) and removes it — the site layout renders the title
 * from frontmatter, so a duplicate H1 in the body would show twice.
 * Only strips a heading that appears before any other content.
 */
export function extractH1Title(body: string): H1Extraction {
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  const headingMatch = i < lines.length ? /^#\s+(.+?)\s*#*\s*$/.exec(lines[i]) : null;
  if (!headingMatch) {
    return { title: null, body };
  }
  const title = headingMatch[1].trim();
  // Drop the heading line and one following blank line (if present).
  let end = i + 1;
  if (end < lines.length && lines[end].trim() === '') end++;
  const remaining = [...lines.slice(0, i), ...lines.slice(end)];
  return { title, body: remaining.join('\n').replace(/^\n+/, '') };
}
