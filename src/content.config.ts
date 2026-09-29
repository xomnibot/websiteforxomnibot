import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  writeupSchema,
  researchSchema,
  projectSchema,
  blogSchema,
  cheatsheetSchema,
} from './lib/schemas';

interface GenerateIdOptions {
  entry: string;
  data: Record<string, unknown>;
}

/**
 * Entry id / URL slug:
 * - `data.slug` if present, else
 * - the file path without extension, with a trailing `/index` removed,
 *   using only the last path segment
 *   (`writeups/active-directory/foo/index.mdx` -> `foo`).
 */
function generateId({ entry, data }: GenerateIdOptions): string {
  if (typeof data.slug === 'string' && data.slug.trim().length > 0) {
    return data.slug.trim();
  }
  const withoutExt = entry.replace(/\.(mdx|md)$/i, '');
  const withoutIndex = withoutExt.replace(/\/index$/i, '');
  const segments = withoutIndex.split('/');
  return segments[segments.length - 1] ?? withoutIndex;
}

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/writeups', generateId }),
  schema: writeupSchema,
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/research', generateId }),
  schema: researchSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects', generateId }),
  schema: projectSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog', generateId }),
  schema: blogSchema,
});

const cheatsheets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/cheatsheets', generateId }),
  schema: cheatsheetSchema,
});

export const collections = { writeups, research, projects, blog, cheatsheets };
