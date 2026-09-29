/**
 * Plain zod schemas for all content collections.
 *
 * IMPORTANT: this file must stay free of `astro:*` imports so it can be
 * imported client-side by the /admin app (Agent 5) to validate frontmatter
 * in the browser before committing to GitHub.
 *
 * Legacy field names (from the old Vite/React site) are accepted via
 * `z.preprocess` aliasing so old-format files still validate untouched.
 * Unknown keys (e.g. `type`, `id`, `readingTime`) are silently stripped by
 * zod's default object behavior.
 */
import { z } from 'zod';

export const COLLECTIONS = ['writeups', 'research', 'projects', 'blog', 'cheatsheets'] as const;
export type CollectionKey = (typeof COLLECTIONS)[number];

/** Copies a legacy key's value onto its new key when the new key is absent. */
function withAliases(raw: unknown, aliasMap: Record<string, string>): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  const data: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  for (const [newKey, oldKey] of Object.entries(aliasMap)) {
    if (data[newKey] === undefined && data[oldKey] !== undefined) {
      data[newKey] = data[oldKey];
    }
  }
  return data;
}

/** Aliases shared by every collection. */
const COMMON_ALIASES: Record<string, string> = {
  description: 'summary',
  updated: 'lastUpdated',
  cover: 'featuredImage',
};

/**
 * Common fields for every collection.
 * `description` is optional (defaults to ''); when a post omits it, UI code
 * should fall back to `entryDescription()` from `lib/collections.ts`, which
 * derives a description from the first paragraph of the body.
 */
const baseFields = {
  title: z.string(),
  description: z.string().default(''),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  slug: z.string().optional(),
};

// ---------------------------------------------------------------------------
// writeups
// ---------------------------------------------------------------------------
export const writeupSchema = z.preprocess(
  (raw) => withAliases(raw, COMMON_ALIASES),
  z.object({
    ...baseFields,
    platform: z.string().default('Custom Lab'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']).optional(),
    category: z.string().default('General'),
    tools: z.array(z.string()).default([]),
    objectives: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
  }),
);

// ---------------------------------------------------------------------------
// research
// ---------------------------------------------------------------------------
export const researchSchema = z.preprocess(
  (raw) => withAliases(raw, COMMON_ALIASES),
  z.object({
    ...baseFields,
    category: z.string().default('Vulnerability Research'),
    cve: z.string().optional(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    cvss: z.number().optional(),
    impact: z.string().optional(),
    affectedSystems: z.string().optional(),
  }),
);

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------
const PROJECT_ALIASES: Record<string, string> = {
  ...COMMON_ALIASES,
  repo: 'githubUrl',
  demo: 'demoUrl',
  docs: 'docsUrl',
  install: 'installation',
};

export const projectSchema = z.preprocess(
  (raw) => withAliases(raw, PROJECT_ALIASES),
  z.object({
    ...baseFields,
    category: z.string().default('Security Tools'),
    repo: z.string().optional(),
    demo: z.string().optional(),
    docs: z.string().optional(),
    language: z.string().optional(),
    license: z.string().optional(),
    stars: z.number().optional(),
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    features: z.array(z.string()).default([]),
    install: z.array(z.string()).default([]),
  }),
);

// ---------------------------------------------------------------------------
// blog
// ---------------------------------------------------------------------------
export const blogSchema = z.preprocess(
  (raw) => withAliases(raw, COMMON_ALIASES),
  z.object({
    ...baseFields,
    category: z.string().default('General'),
  }),
);

// ---------------------------------------------------------------------------
// cheatsheets
// ---------------------------------------------------------------------------
const cheatsheetItemSchema = z.object({
  command: z.string(),
  description: z.string(),
  example: z.string().optional(),
});

const cheatsheetSectionSchema = z.object({
  title: z.string(),
  items: z.array(cheatsheetItemSchema).default([]),
});

export const cheatsheetSchema = z.preprocess(
  (raw) => withAliases(raw, COMMON_ALIASES),
  z.object({
    ...baseFields,
    category: z.string().default('General'),
    sections: z.array(cheatsheetSectionSchema).default([]),
  }),
);

// ---------------------------------------------------------------------------
// exports
// ---------------------------------------------------------------------------
export const schemas = {
  writeups: writeupSchema,
  research: researchSchema,
  projects: projectSchema,
  blog: blogSchema,
  cheatsheets: cheatsheetSchema,
} satisfies Record<CollectionKey, z.ZodType>;

export type WriteupFrontmatter = z.infer<typeof writeupSchema>;
export type ResearchFrontmatter = z.infer<typeof researchSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type BlogFrontmatter = z.infer<typeof blogSchema>;
export type CheatsheetFrontmatter = z.infer<typeof cheatsheetSchema>;
export type CheatsheetSection = z.infer<typeof cheatsheetSectionSchema>;
export type CheatsheetItem = z.infer<typeof cheatsheetItemSchema>;
