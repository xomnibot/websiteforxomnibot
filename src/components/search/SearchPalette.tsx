import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Fuse, { type FuseResult } from 'fuse.js';
import { Search, X, ArrowUp, ArrowDown, CornerDownLeft, Command, Loader2 } from 'lucide-react';
import { navigate } from 'astro:transitions/client';
import type { SearchCollection, SearchEntry } from './search-types';
import { fuseOptions, MAX_RESULTS, SCORE_CUTOFF } from './fuse-options';
import { addRecentSearch, clearRecentSearches, loadRecentSearches } from './recent-searches';
import { collectionOrder } from './collection-meta';
import { ResultsGroups, SkeletonList, ErrorState, NoResults, EmptyState, optionId } from './SearchResultsList';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/** Module-scope cache so the fetched index survives even if this island were
 * ever remounted (it shouldn't be, thanks to `transition:persist` in
 * BaseLayout — see final report — but this keeps a second open free either way). */
let cachedIndex: SearchEntry[] | null = null;
let inflightFetch: Promise<SearchEntry[]> | null = null;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  (window as unknown as { __setTheme?: (theme: 'light' | 'dark') => void }).__setTheme?.(isDark ? 'light' : 'dark');
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [entries, setEntries] = useState<SearchEntry[] | null>(() => cachedIndex);
  const [loadState, setLoadState] = useState<LoadState>(() => (cachedIndex ? 'ready' : 'idle'));
  const [recent, setRecent] = useState<string[]>([]);

  const openRef = useRef(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const fetchIndex = useCallback(() => {
    setLoadState('loading');
    inflightFetch =
      inflightFetch ??
      fetch('/search.json').then((res) => {
        if (!res.ok) throw new Error(`search.json responded ${res.status}`);
        return res.json() as Promise<SearchEntry[]>;
      });
    inflightFetch
      .then((data) => {
        cachedIndex = data;
        setEntries(data);
        setLoadState('ready');
      })
      .catch(() => {
        inflightFetch = null;
        setLoadState('error');
      });
  }, []);

  const openPalette = useCallback(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  // Always-on listeners, registered exactly once for this island's lifetime.
  // The island stays mounted across view transitions (see BaseLayout's
  // `transition:persist`), so this effect never re-runs and never
  // double-registers — it only opens/closes what's already rendered.
  useEffect(() => {
    function onOpenSearchEvent() {
      openPalette();
    }
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (openRef.current) closePalette();
        else openPalette();
      } else if (e.key === '/' && !isMod && !isTypingTarget(e.target) && !openRef.current) {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape' && openRef.current) {
        closePalette();
      }
    }
    window.addEventListener('open-search', onOpenSearchEvent);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('open-search', onOpenSearchEvent);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openPalette, closePalette]);

  // Open/close side effects: scroll lock, focus management, lazy fetch.
  useEffect(() => {
    if (open) {
      setRecent(loadRecentSearches());
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
      if (loadState === 'idle') fetchIndex();
      return () => {
        document.body.style.overflow = prevOverflow;
        window.clearTimeout(focusTimer);
      };
    }
    setQuery('');
    setActiveIndex(0);
    previouslyFocused.current?.focus();
    return undefined;
  }, [open, fetchIndex, loadState]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const fuse = useMemo(() => (entries ? new Fuse(entries, fuseOptions) : null), [entries]);

  const results = useMemo<FuseResult<SearchEntry>[]>(() => {
    if (!fuse || !query.trim()) return [];
    return fuse.search(query.trim(), { limit: MAX_RESULTS }).filter((r) => r.score === undefined || r.score <= SCORE_CUTOFF);
  }, [fuse, query]);

  const grouped = useMemo<[SearchCollection, FuseResult<SearchEntry>[]][]>(() => {
    const buckets = new Map<SearchCollection, FuseResult<SearchEntry>[]>();
    for (const result of results) {
      const list = buckets.get(result.item.collection) ?? [];
      list.push(result);
      buckets.set(result.item.collection, list);
    }
    return collectionOrder
      .filter((c) => buckets.has(c))
      .map((c) => [c, buckets.get(c) as FuseResult<SearchEntry>[]]);
  }, [results]);

  const flatResults = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  const commitQuery = useCallback((q: string) => {
    setRecent(addRecentSearch(q));
  }, []);

  const openEntry = useCallback(
    (entry: SearchEntry, newTab: boolean) => {
      if (query.trim()) commitQuery(query);
      if (newTab) {
        window.open(entry.href, '_blank', 'noopener,noreferrer');
        return;
      }
      closePalette();
      navigate(entry.href);
    },
    [query, commitQuery, closePalette],
  );

  function handleInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        if (flatResults.length) {
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % flatResults.length);
        }
        break;
      case 'ArrowUp':
        if (flatResults.length) {
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
        }
        break;
      case 'Enter': {
        const target = flatResults[activeIndex]?.item;
        if (!target) break;
        e.preventDefault();
        openEntry(target, e.metaKey || e.ctrlKey);
        break;
      }
      default:
        break;
    }
  }

  function trapFocus(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const root = panelRef.current;
    if (!root) return;
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  const trimmedQuery = query.trim();
  const activeOptionId = flatResults[activeIndex] ? optionId(activeIndex) : undefined;

  return (
    <div
      className="search-palette-backdrop fixed inset-0 z-50 flex items-start justify-center bg-bg/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closePalette();
      }}
    >
      {/* Scoped to this island; disabled entirely under reduced motion. */}
      <style>{`
        .search-palette-backdrop { animation: search-palette-fade 140ms ease-out; }
        .search-palette-panel { animation: search-palette-scale-in 140ms cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes search-palette-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes search-palette-scale-in {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .search-palette-backdrop, .search-palette-panel { animation: none; }
        }
      `}</style>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-palette-heading"
        onKeyDown={trapFocus}
        className="search-palette-panel flex h-full w-full flex-col overflow-hidden border-line bg-elevated shadow-2xl sm:h-auto sm:max-h-[32rem] sm:w-full sm:max-w-xl sm:rounded-xl sm:border"
      >
        <h2 id="search-palette-heading" className="sr-only">
          Search xomnibot.in
        </h2>

        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-subtle" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-palette-listbox"
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            aria-label="Search writeups, research, projects, blog and cheatsheets"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search writeups, research, CVEs, tools…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-14 flex-1 bg-transparent font-sans text-sm text-fg placeholder:text-subtle focus:outline-none"
          />
          {loadState === 'loading' && <Loader2 className="size-4 shrink-0 animate-spin text-subtle" aria-hidden="true" />}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-md p-1 text-subtle hover:text-fg"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closePalette}
            aria-label="Close search"
            className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle hover:text-fg sm:inline-flex"
          >
            Esc
          </button>
        </div>

        <div
          id="search-palette-listbox"
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {loadState === 'loading' && !entries && <SkeletonList />}
          {loadState === 'error' && <ErrorState onRetry={fetchIndex} />}
          {loadState === 'ready' && !trimmedQuery && (
            <EmptyState
              recent={recent}
              onSelectRecent={(q) => {
                setQuery(q);
                inputRef.current?.focus();
              }}
              onClearRecent={() => setRecent(clearRecentSearches())}
              onToggleTheme={toggleTheme}
            />
          )}
          {loadState === 'ready' && trimmedQuery && flatResults.length === 0 && <NoResults query={trimmedQuery} />}
          {loadState === 'ready' && trimmedQuery && flatResults.length > 0 && (
            <ResultsGroups
              grouped={grouped}
              flatResults={flatResults}
              activeIndex={activeIndex}
              onHoverIndex={setActiveIndex}
              onSelect={(entry) => openEntry(entry, false)}
              onSelectNewTab={(entry) => openEntry(entry, true)}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-subtle">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="size-3" />
              <ArrowDown className="size-3" />
              Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="size-3" />
              Open
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Command className="size-3" />+<CornerDownLeft className="size-3" />
              New tab
            </span>
          </div>
          {entries && <span>{entries.length} indexed</span>}
        </div>
      </div>
    </div>
  );
}
