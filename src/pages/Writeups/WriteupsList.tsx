import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { WriteupCard } from '@/components/cards/WriteupCard';
import { contentService } from '@/services/contentService';
import { Platform, Difficulty } from '@/types/content';
import { Filter, Search, ShieldAlert } from 'lucide-react';

const platforms: Platform[] = ['TryHackMe', 'Hack The Box', 'PortSwigger', 'picoCTF', 'VulnHub', 'Active Directory'];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];

export const WriteupsListPage: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allWriteups = contentService.getWriteups();

  const filteredWriteups = allWriteups.filter((w) => {
    if (selectedPlatform !== 'All' && w.platform.toLowerCase() !== selectedPlatform.toLowerCase()) return false;
    if (selectedDifficulty !== 'All' && w.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchSummary = w.summary.toLowerCase().includes(q);
      const matchTag = w.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTag) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Writeups' }]} />

      <SectionHeader
        badge="Ethical Hacking Walkthroughs"
        title="CTF & Security Machine Writeups"
        subtitle="Step-by-step methodologies covering Web Security, Active Directory, Reverse Engineering, and Binary Exploitation."
      />

      {/* Filter Controls & Search Input */}
      <div className="p-5 rounded-xl glass-panel border border-border space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter writeups..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> Platform:
            </span>
            <button
              onClick={() => setSelectedPlatform('All')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedPlatform === 'All'
                  ? 'bg-emerald-400 text-black font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  selectedPlatform === p
                    ? 'bg-emerald-400 text-black font-semibold'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
          <span className="text-xs font-mono text-muted-foreground mr-1">Difficulty:</span>
          <button
            onClick={() => setSelectedDifficulty('All')}
            className={`px-2.5 py-0.5 text-xs font-mono rounded transition-colors ${
              selectedDifficulty === 'All'
                ? 'bg-zinc-700 text-white font-semibold'
                : 'bg-muted/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-0.5 text-xs font-mono rounded transition-colors ${
                selectedDifficulty === d
                  ? 'bg-zinc-700 text-white font-semibold'
                  : 'bg-muted/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Writeups */}
      {filteredWriteups.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <ShieldAlert className="w-8 h-8 text-emerald-400/50 mx-auto" />
          <p>No writeups match your current filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWriteups.map((w) => (
            <WriteupCard key={w.id} writeup={w} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
