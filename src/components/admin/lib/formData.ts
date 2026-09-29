/**
 * Converts between: parsed frontmatter <-> admin form state <-> the ordered
 * object handed to `dumpFrontmatter`. Kept free of DOM/React so it's unit
 * testable in isolation.
 */
import type { CollectionKey } from '@/lib/schemas';
import { schemas } from '@/lib/schemas';
import { toDateOnly } from './frontmatter';
import type { FrontmatterFieldError } from './types';

export interface AdminFormState {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD or ''
  tags: string[];
  draft: boolean;
  featured: boolean;
  cover: string; // sanitized image filename, absolute URL, or ''
  coverAlt: string;
  slug: string;
  extras: Record<string, string | string[]>;
  /** cheatsheets-only: preserved verbatim if present on the uploaded file, no UI is built for it. */
  sectionsRaw?: unknown;
}

/** Today's LOCAL calendar date as YYYY-MM-DD (mirrors scripts/new.mjs's todayISO). */
export function todayLocalISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function asString(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function firstDefined(...values: unknown[]): unknown {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

const EXTRA_DEFAULTS: Record<CollectionKey, Record<string, string | string[]>> = {
  writeups: {
    platform: 'Custom Lab',
    difficulty: '',
    category: 'General',
    tools: [],
    objectives: [],
    prerequisites: [],
  },
  research: {
    category: 'Vulnerability Research',
    cve: '',
    severity: '',
    cvss: '',
    impact: '',
    affectedSystems: '',
  },
  projects: {
    category: 'Security Tools',
    repo: '',
    demo: '',
    docs: '',
    language: '',
    license: '',
    stars: '',
    status: 'active',
    features: [],
    install: [],
  },
  blog: { category: 'General' },
  cheatsheets: { category: 'General' },
};

/** A brand-new, empty form for `collection` (used for "write/paste instead" with no file). */
export function defaultFormState(collection: CollectionKey): AdminFormState {
  return {
    title: '',
    description: '',
    date: todayLocalISODate(),
    updated: '',
    tags: [],
    draft: true,
    featured: false,
    cover: '',
    coverAlt: '',
    slug: '',
    extras: { ...EXTRA_DEFAULTS[collection] },
  };
}

/**
 * Leniently maps raw parsed-YAML frontmatter (may be incomplete / invalid)
 * onto form state, applying the same legacy aliases as schemas.ts. Does NOT
 * validate — call `validateFrontmatterData` separately for that.
 */
export function frontmatterToFormState(collection: CollectionKey, data: Record<string, unknown>): AdminFormState {
  const base = defaultFormState(collection);
  const title = asString(firstDefined(data.title), '');
  const description = asString(firstDefined(data.description, data.summary), '');
  const date = toDateOnly(data.date) ?? '';
  const updated = toDateOnly(firstDefined(data.updated, data.lastUpdated)) ?? '';
  const tags = asStringArray(data.tags);
  const draft = Boolean(data.draft);
  const featured = Boolean(data.featured);
  const cover = asString(firstDefined(data.cover, data.featuredImage), '');
  const coverAlt = asString(firstDefined(data.coverAlt), '');
  const slug = asString(firstDefined(data.slug), '');

  const extras: Record<string, string | string[]> = { ...base.extras };
  switch (collection) {
    case 'writeups':
      extras.platform = asString(firstDefined(data.platform), 'Custom Lab');
      extras.difficulty = asString(firstDefined(data.difficulty), '');
      extras.category = asString(firstDefined(data.category), 'General');
      extras.tools = asStringArray(data.tools);
      extras.objectives = asStringArray(data.objectives);
      extras.prerequisites = asStringArray(data.prerequisites);
      break;
    case 'research':
      extras.category = asString(firstDefined(data.category), 'Vulnerability Research');
      extras.cve = asString(firstDefined(data.cve), '');
      extras.severity = asString(firstDefined(data.severity), '');
      extras.cvss = asString(firstDefined(data.cvss), '');
      extras.impact = asString(firstDefined(data.impact), '');
      extras.affectedSystems = asString(firstDefined(data.affectedSystems), '');
      break;
    case 'projects':
      extras.category = asString(firstDefined(data.category), 'Security Tools');
      extras.repo = asString(firstDefined(data.repo, data.githubUrl), '');
      extras.demo = asString(firstDefined(data.demo, data.demoUrl), '');
      extras.docs = asString(firstDefined(data.docs, data.docsUrl), '');
      extras.language = asString(firstDefined(data.language), '');
      extras.license = asString(firstDefined(data.license), '');
      extras.stars = asString(firstDefined(data.stars), '');
      extras.status = asString(firstDefined(data.status), 'active');
      extras.features = asStringArray(data.features);
      extras.install = asStringArray(firstDefined(data.install, data.installation));
      break;
    case 'blog':
      extras.category = asString(firstDefined(data.category), 'General');
      break;
    case 'cheatsheets':
      extras.category = asString(firstDefined(data.category), 'General');
      break;
  }

  return {
    title,
    description,
    date,
    updated,
    tags,
    draft,
    featured,
    cover,
    coverAlt,
    slug,
    extras,
    sectionsRaw: collection === 'cheatsheets' ? data.sections : undefined,
  };
}

/** Builds the ordered object to hand to `dumpFrontmatter` (before pruning). */
export function formStateToFrontmatterObject(
  collection: CollectionKey,
  form: AdminFormState,
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    title: form.title.trim(),
    description: form.description.trim(),
    date: form.date || todayLocalISODate(),
    updated: form.updated || undefined,
    tags: form.tags,
    draft: form.draft,
    featured: form.featured,
    cover: form.cover || undefined,
    coverAlt: form.coverAlt.trim() || undefined,
  };

  const e = form.extras;
  const num = (v: string | string[] | undefined): number | undefined => {
    const s = Array.isArray(v) ? '' : (v ?? '').trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };
  const str = (v: string | string[] | undefined): string | undefined => {
    const s = Array.isArray(v) ? '' : (v ?? '').trim();
    return s || undefined;
  };
  const arr = (v: string | string[] | undefined): string[] =>
    Array.isArray(v) ? v.map((s) => s.trim()).filter(Boolean) : [];

  switch (collection) {
    case 'writeups':
      out.platform = str(e.platform) ?? 'Custom Lab';
      out.difficulty = str(e.difficulty);
      out.category = str(e.category) ?? 'General';
      out.tools = arr(e.tools);
      out.objectives = arr(e.objectives);
      out.prerequisites = arr(e.prerequisites);
      break;
    case 'research':
      out.category = str(e.category) ?? 'Vulnerability Research';
      out.cve = str(e.cve);
      out.severity = str(e.severity);
      out.cvss = num(e.cvss);
      out.impact = str(e.impact);
      out.affectedSystems = str(e.affectedSystems);
      break;
    case 'projects':
      out.category = str(e.category) ?? 'Security Tools';
      out.repo = str(e.repo);
      out.demo = str(e.demo);
      out.docs = str(e.docs);
      out.language = str(e.language);
      out.license = str(e.license);
      out.stars = num(e.stars);
      out.status = str(e.status) ?? 'active';
      out.features = arr(e.features);
      out.install = arr(e.install);
      break;
    case 'blog':
      out.category = str(e.category) ?? 'General';
      break;
    case 'cheatsheets':
      out.category = str(e.category) ?? 'General';
      if (form.sectionsRaw !== undefined) out.sections = form.sectionsRaw;
      break;
  }

  return out;
}

export interface ValidationOutcome {
  success: boolean;
  errors: FrontmatterFieldError[];
}

/** Validates a frontmatter object against the collection's zod schema (from schemas.ts). */
export function validateFrontmatterData(collection: CollectionKey, data: Record<string, unknown>): ValidationOutcome {
  const schema = schemas[collection];
  const result = schema.safeParse(data);
  if (result.success) return { success: true, errors: [] };
  const errors: FrontmatterFieldError[] = result.error.issues.map((issue) => ({
    path: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
  return { success: false, errors };
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}
