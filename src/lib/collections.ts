import { getCollection, type CollectionEntry } from 'astro:content';
import { COLLECTIONS, type CollectionKey } from './schemas';
import { readingTime, stripMarkdown, slugify } from './utils';

export type { CollectionKey };
/** Union of every collection's entry type. */
export type AnyEntry = CollectionEntry<CollectionKey>;

export const collectionMeta: Record<
  CollectionKey,
  { label: string; singular: string; description: string; href: string; eyebrow: string }
> = {
  writeups: {
    label: 'Writeups',
    singular: 'Writeup',
    description: 'CTF and lab walkthroughs across TryHackMe, Hack The Box, PortSwigger, and more.',
    href: '/writeups',
    eyebrow: '// writeups',
  },
  research: {
    label: 'Research',
    singular: 'Research',
    description: 'Vulnerability research, CVE breakdowns, and exploit internals.',
    href: '/research',
    eyebrow: '// research',
  },
  projects: {
    label: 'Projects',
    singular: 'Project',
    description: 'Open-source security tools and CLI utilities.',
    href: '/projects',
    eyebrow: '// projects',
  },
  blog: {
    label: 'Blog',
    singular: 'Post',
    description: 'A personal corner: thoughts, notes and whatever is on my mind.',
    href: '/blog',
    eyebrow: '// blog',
  },
  cheatsheets: {
    label: 'Cheat Sheets',
    singular: 'Cheat Sheet',
    description: 'Fast-reference command sheets for tools used in day-to-day research.',
    href: '/cheatsheets',
    eyebrow: '// cheatsheets',
  },
};

/** Published entries for one collection, drafts excluded in production, sorted newest first. */
export async function getPublished<C extends CollectionKey>(c: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(c, ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** All published entries across every collection, newest first. */
export async function getAllPublished(): Promise<AnyEntry[]> {
  const all = await Promise.all(COLLECTIONS.map((c) => getPublished(c)));
  return (all.flat() as AnyEntry[]).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Canonical site-relative URL for an entry, e.g. `/writeups/tryhackme-pickle-rick`. */
export function entryHref(entry: AnyEntry): string {
  return `/${entry.collection}/${entry.id}`;
}

/** "N min read", computed from the entry body (not frontmatter). */
export function entryReadingTime(entry: AnyEntry): string {
  return readingTime(entry.body ?? '');
}

/**
 * The entry's description, or — when frontmatter `description` is empty —
 * a fallback derived from the first real paragraph of the body (~160 chars).
 * Use this everywhere a description is displayed; do not read
 * `entry.data.description` directly, since it may be ''.
 */
export function entryDescription(entry: AnyEntry): string {
  const fromFrontmatter = entry.data.description?.trim();
  if (fromFrontmatter) return fromFrontmatter;

  // Drop whole heading lines before stripping markdown, so a body that
  // opens straight into "## Overview" (no lead-in paragraph — a very common
  // pattern) doesn't have the heading's own text ("Overview") picked up as
  // the "first paragraph" below. stripMarkdown() only strips the `#`
  // marker and would otherwise leave the heading text behind as its own
  // paragraph-like block.
  const bodyWithoutHeadings = (entry.body ?? '').replace(/^ {0,3}#{1,6}\s+.*$/gm, '');
  const plain = stripMarkdown(bodyWithoutHeadings);
  const paragraphs = plain
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const first = paragraphs[0] ?? '';
  if (!first) return '';
  if (first.length <= 160) return first;
  return `${first.slice(0, 160).replace(/\s+\S*$/, '')}…`;
}

/** Distinct tags across all published entries, with slug + usage count, most-used first. */
export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const entries = await getAllPublished();
  const counts = new Map<string, { tag: string; slug: string; count: number }>();
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const slug = slugify(tag);
      const existing = counts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(slug, { tag, slug, count: 1 });
      }
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Neighboring entries within the same collection, ordered by date.
 * `prev` is the older post, `next` is the newer post.
 */
export async function getAdjacent(
  entry: AnyEntry,
): Promise<{ prev?: AnyEntry; next?: AnyEntry }> {
  const siblings = await getPublished(entry.collection);
  const index = siblings.findIndex((e) => e.id === entry.id);
  if (index === -1) return {};
  return {
    prev: siblings[index + 1] as AnyEntry | undefined,
    next: siblings[index - 1] as AnyEntry | undefined,
  };
}

/** Entries sharing the most tags with `entry`, same collection preferred, newest first. */
export async function getRelated(entry: AnyEntry, limit = 3): Promise<AnyEntry[]> {
  const tags = new Set(entry.data.tags.map((t) => t.toLowerCase()));
  if (tags.size === 0) return [];

  const all = await getAllPublished();
  const scored = all
    .filter((candidate) => !(candidate.collection === entry.collection && candidate.id === entry.id))
    .map((candidate) => ({
      candidate,
      overlap: candidate.data.tags.filter((t) => tags.has(t.toLowerCase())).length,
      sameCollection: candidate.collection === entry.collection,
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => {
      if (a.overlap !== b.overlap) return b.overlap - a.overlap;
      if (a.sameCollection !== b.sameCollection) return a.sameCollection ? -1 : 1;
      return b.candidate.data.date.valueOf() - a.candidate.data.date.valueOf();
    });

  return scored.slice(0, limit).map((s) => s.candidate);
}
