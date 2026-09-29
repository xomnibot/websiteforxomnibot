import type { FuseResultMatch } from 'fuse.js';

export interface HighlightSegment {
  text: string;
  matched: boolean;
}

/**
 * Splits `text` into alternating matched/unmatched segments given Fuse's
 * `[start, end]` (inclusive) match ranges, so callers can wrap matched
 * segments in `<mark>` for title highlighting.
 */
export function highlightSegments(
  text: string,
  ranges: ReadonlyArray<readonly [number, number]> = [],
): HighlightSegment[] {
  if (!text) return [];
  if (!ranges.length) return [{ text, matched: false }];

  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const [start, end] of sorted) {
    if (start >= text.length || end < start) continue;
    const safeStart = Math.max(start, cursor);
    const safeEnd = Math.min(end, text.length - 1);
    if (safeEnd < safeStart) continue;
    if (safeStart > cursor) segments.push({ text: text.slice(cursor, safeStart), matched: false });
    segments.push({ text: text.slice(safeStart, safeEnd + 1), matched: true });
    cursor = safeEnd + 1;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), matched: false });
  return segments;
}

/** Finds the match entry for a given field name (e.g. 'title') on a Fuse result. */
export function matchFor(
  matches: ReadonlyArray<FuseResultMatch> | undefined,
  key: string,
): FuseResultMatch | undefined {
  return matches?.find((m) => m.key === key);
}
