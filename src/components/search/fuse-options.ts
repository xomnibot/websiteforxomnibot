import type { IFuseOptions } from 'fuse.js';
import type { SearchEntry } from './search-types';

/**
 * Weighted so title matches dominate, tags/CVE ids are strong signals,
 * headings and description are moderate, and full-body text is a wide net.
 * `ignoreLocation: true` is required — our `text` field is capped at ~3000
 * chars, far past Fuse's default 100-char match `distance`, which would
 * otherwise silently reject matches deep in the body (e.g. a command inside
 * a long cheatsheet's text).
 */
export const fuseOptions: IFuseOptions<SearchEntry> = {
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  threshold: 0.32,
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'tags', weight: 0.2 },
    { name: 'cve', weight: 0.2 },
    { name: 'headings', weight: 0.1 },
    { name: 'description', weight: 0.08 },
    { name: 'text', weight: 0.04 },
  ],
};

/** Cap on results returned by Fuse before grouping, to keep the list snappy. */
export const MAX_RESULTS = 40;

/**
 * A weighted multi-key search can still return a document whose *overall*
 * score is poor (near 1 = mismatch) when only one low-weight key (`text`)
 * barely cleared its per-key threshold and every other key contributed
 * nothing. Drop those from the UI — real matches score far below this.
 */
export const SCORE_CUTOFF = 0.85;
