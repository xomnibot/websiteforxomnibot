/**
 * Shared shape of one row in `/search.json`.
 *
 * IMPORTANT: this file must stay free of `astro:*` imports — it is imported
 * both by the server-only endpoint (`src/pages/search.json.ts`) and by the
 * client-side React island (`SearchPalette.tsx` and friends), which is
 * bundled for the browser. Only `@/lib/schemas` (also astro:*-free) is
 * reused here for the collection-key union.
 */
import type { CollectionKey } from '@/lib/schemas';

/** `CollectionKey` plus the synthetic 'page' bucket for static pages. */
export type SearchCollection = CollectionKey | 'page';

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  collection: SearchCollection;
  category?: string;
  tags: string[];
  /** ISO 8601 date string. */
  date: string;
  cve?: string;
  platform?: string;
  difficulty?: string;
  headings: string[];
  /** Plain-text body, Markdown/MDX/code-fence syntax stripped, capped to ~3000 chars. */
  text: string;
}
