/**
 * Client-safe display metadata for search result groups.
 *
 * Deliberately NOT imported from `@/lib/collections` — that module pulls in
 * `astro:content`, a server-only virtual module. Importing it here would
 * drag server-only content-collection code into the browser bundle for this
 * React island. This file duplicates the small bits (labels/hrefs) it needs.
 */
import type { CollectionKey } from '@/lib/schemas';
import {
  Terminal,
  FlaskConical,
  FolderGit2,
  Newspaper,
  FileText,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import type { SearchCollection } from './search-types';

export const collectionLabels: Record<SearchCollection, string> = {
  writeups: 'Writeups',
  research: 'Research',
  projects: 'Projects',
  blog: 'Blog',
  cheatsheets: 'Cheat Sheets',
  page: 'Pages',
};

export const collectionHrefs: Record<CollectionKey, string> = {
  writeups: '/writeups',
  research: '/research',
  projects: '/projects',
  blog: '/blog',
  cheatsheets: '/cheatsheets',
};

export const collectionIcons: Record<SearchCollection, LucideIcon> = {
  writeups: Terminal,
  research: FlaskConical,
  projects: FolderGit2,
  blog: Newspaper,
  cheatsheets: FileText,
  page: Compass,
};

/** Order collections should appear in when several groups are shown at once. */
export const collectionOrder: SearchCollection[] = [
  'writeups',
  'research',
  'projects',
  'blog',
  'cheatsheets',
  'page',
];
