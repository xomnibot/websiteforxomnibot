import React from 'react';
import { useSearch } from '@/hooks/useSearch';
import { contentService } from '@/services/contentService';
import { Link } from 'react-router-dom';
import { Search, X, ShieldAlert, Terminal, Code2, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { Tag } from '@/components/common/Tag';

export const SearchModal: React.FC = () => {
  const { isOpen, closeSearch, query, setQuery } = useSearch();

  if (!isOpen) return null;

  const results = contentService.searchAll(query);
  const totalResults =
    results.writeups.length +
    results.research.length +
    results.projects.length +
    results.blog.length +
    results.cheatsheets.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800">
          <Search className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search writeups, CVE research, tools, cheat sheets (Ctrl + K)..."
            autoFocus
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm font-sans focus:outline-none"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-colors ml-2 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="text-center py-8 text-muted-foreground text-sm font-mono">
              <Terminal className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
              <span>Type keywords to query platform content across all research domains.</span>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="text-center py-10 text-muted-foreground font-mono text-sm">
              No matching research, writeups, or tooling found for &quot;<span className="text-emerald-400">{query}</span>&quot;.
            </div>
          )}

          {/* Writeups Section */}
          {results.writeups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-2 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Writeups ({results.writeups.length})</span>
              </div>
              <div className="space-y-2">
                {results.writeups.map((w) => (
                  <Link
                    key={w.id}
                    to={`/writeups/${w.slug}`}
                    onClick={closeSearch}
                    className="block p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-medium text-sm text-foreground group-hover:text-emerald-400 flex items-center gap-2">
                        <span>{w.title}</span>
                        <Tag difficulty={w.difficulty} variant="difficulty" size="sm">
                          {w.difficulty}
                        </Tag>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{w.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Research Section */}
          {results.research.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-2 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>CVE Research ({results.research.length})</span>
              </div>
              <div className="space-y-2">
                {results.research.map((r) => (
                  <Link
                    key={r.id}
                    to={`/research/${r.slug}`}
                    onClick={closeSearch}
                    className="block p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-medium text-sm text-foreground group-hover:text-cyan-400">
                        {r.title}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{r.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {results.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold mb-2 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Projects ({results.projects.length})</span>
              </div>
              <div className="space-y-2">
                {results.projects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.slug}`}
                    onClick={closeSearch}
                    className="block p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-medium text-sm text-foreground group-hover:text-purple-400">
                        {p.title}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cheatsheets Section */}
          {results.cheatsheets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold mb-2 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Cheat Sheets ({results.cheatsheets.length})</span>
              </div>
              <div className="space-y-2">
                {results.cheatsheets.map((c) => (
                  <Link
                    key={c.id}
                    to={`/cheatsheets/${c.slug}`}
                    onClick={closeSearch}
                    className="block p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-medium text-sm text-foreground group-hover:text-amber-400">
                        {c.title}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{c.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-foreground">ESC</kbd> to exit</span>
          <span>Shortcut: <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-foreground">Ctrl + K</kbd></span>
        </div>
      </div>
    </div>
  );
};
