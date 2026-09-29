import type { FuseResult } from 'fuse.js';
import { Clock, Search, Sun, Moon, Trash2, type LucideIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { SearchCollection, SearchEntry } from './search-types';
import { collectionHrefs, collectionIcons, collectionLabels } from './collection-meta';
import { highlightSegments, matchFor } from './highlight';
import { difficultyTone, toneClasses } from './tone';

function Highlighted({ text, ranges }: { text: string; ranges?: ReadonlyArray<readonly [number, number]> }) {
  const segments = highlightSegments(text, ranges);
  return (
    <>
      {segments.map((seg, i) =>
        seg.matched ? (
          <mark key={i} className="rounded-sm bg-accent/25 text-fg">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

export function optionId(index: number): string {
  return `search-option-${index}`;
}

interface ResultRowProps {
  result: FuseResult<SearchEntry>;
  index: number;
  active: boolean;
  onHover: (index: number) => void;
  onSelect: (entry: SearchEntry) => void;
  onSelectNewTab: (entry: SearchEntry) => void;
}

function ResultRow({ result, index, active, onHover, onSelect, onSelectNewTab }: ResultRowProps) {
  const { item, matches } = result;
  const titleMatch = matchFor(matches, 'title');

  return (
    <li
      id={optionId(index)}
      role="option"
      aria-selected={active}
      onMouseEnter={() => onHover(index)}
      onMouseDown={(e) => {
        // mousedown (not click) so it fires before the input's blur/close logic.
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) onSelectNewTab(item);
        else onSelect(item);
      }}
      className={`group flex cursor-pointer flex-col gap-1 rounded-lg px-3 py-2.5 ${
        active ? 'bg-accent/10' : 'hover:bg-surface'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-fg">
          <Highlighted text={item.title} ranges={titleMatch?.indices} />
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {item.difficulty && (
            <span
              className={`rounded-md border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-wide ${toneClasses[difficultyTone(item.difficulty)]}`}
            >
              {item.difficulty}
            </span>
          )}
          {item.cve && (
            <span className="rounded-md border border-accent-2/30 bg-accent-2/10 px-1.5 py-0.5 font-mono text-[0.625rem] font-medium text-accent-2">
              {item.cve}
            </span>
          )}
        </div>
      </div>
      {item.description && <p className="truncate text-xs text-muted">{item.description}</p>}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-subtle">
        <span>{collectionLabels[item.collection]}</span>
        {item.date && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </>
        )}
      </div>
    </li>
  );
}

interface ResultsGroupsProps {
  grouped: [SearchCollection, FuseResult<SearchEntry>[]][];
  flatResults: FuseResult<SearchEntry>[];
  activeIndex: number;
  onHoverIndex: (index: number) => void;
  onSelect: (entry: SearchEntry) => void;
  onSelectNewTab: (entry: SearchEntry) => void;
}

export function ResultsGroups({
  grouped,
  flatResults,
  activeIndex,
  onHoverIndex,
  onSelect,
  onSelectNewTab,
}: ResultsGroupsProps) {
  let runningIndex = 0;
  return (
    <ul className="flex flex-col gap-3">
      {grouped.map(([collection, results]) => {
        const startIndex = runningIndex;
        runningIndex += results.length;
        const Icon: LucideIcon = collectionIcons[collection];
        return (
          <li key={collection} role="presentation">
            <div className="flex items-center gap-1.5 px-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-subtle">
              <Icon className="size-3" aria-hidden="true" />
              {collectionLabels[collection]}
            </div>
            <ul role="group" aria-label={collectionLabels[collection]} className="flex flex-col">
              {results.map((result, i) => (
                <ResultRow
                  key={`${result.item.collection}-${result.item.href}`}
                  result={result}
                  index={startIndex + i}
                  active={activeIndex === startIndex + i}
                  onHover={onHoverIndex}
                  onSelect={onSelect}
                  onSelectNewTab={onSelectNewTab}
                />
              ))}
            </ul>
          </li>
        );
      })}
      <li className="sr-only" aria-hidden="true">
        {flatResults.length} results
      </li>
    </ul>
  );
}

export function SkeletonList() {
  return (
    <div className="flex flex-col gap-2 p-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg px-3 py-2.5">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-surface" />
          <div className="h-2.5 w-full animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p className="text-sm text-muted">Couldn&apos;t load the search index.</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg hover:border-accent/40"
      >
        Try again
      </button>
    </div>
  );
}

export function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Search className="size-5 text-subtle" aria-hidden="true" />
      <p className="text-sm text-muted">
        No results for <span className="text-fg">&ldquo;{query}&rdquo;</span>
      </p>
      <p className="text-xs text-subtle">Try a different keyword, tag, or CVE id.</p>
    </div>
  );
}

interface EmptyStateProps {
  recent: string[];
  onSelectRecent: (query: string) => void;
  onClearRecent: () => void;
  onToggleTheme: () => void;
}

const QUICK_LINK_COLLECTIONS: SearchCollection[] = ['writeups', 'research', 'projects', 'blog', 'cheatsheets'];

export function EmptyState({ recent, onSelectRecent, onClearRecent, onToggleTheme }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-5 px-1 py-2">
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">Recent</span>
            <button
              type="button"
              onClick={onClearRecent}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-subtle hover:text-fg"
            >
              <Trash2 className="size-3" aria-hidden="true" />
              Clear
            </button>
          </div>
          <ul className="flex flex-col">
            {recent.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => onSelectRecent(q)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-fg"
                >
                  <Clock className="size-3.5 shrink-0 text-subtle" aria-hidden="true" />
                  <span className="truncate">{q}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-subtle">Browse</div>
        <ul className="grid grid-cols-2 gap-1.5 px-1 sm:grid-cols-3">
          {QUICK_LINK_COLLECTIONS.map((collection) => {
            const Icon = collectionIcons[collection];
            const href = collectionHrefs[collection as keyof typeof collectionHrefs];
            return (
              <li key={collection}>
                <a
                  href={href}
                  className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
                >
                  <Icon className="size-3.5 shrink-0 text-subtle" aria-hidden="true" />
                  {collectionLabels[collection]}
                </a>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex w-full items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              <Sun className="size-3.5 shrink-0 text-subtle dark:hidden" aria-hidden="true" />
              <Moon className="hidden size-3.5 shrink-0 text-subtle dark:block" aria-hidden="true" />
              Toggle theme
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
