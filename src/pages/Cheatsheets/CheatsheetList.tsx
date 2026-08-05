import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CheatsheetCard } from '@/components/cards/CheatsheetCard';
import { contentService } from '@/services/contentService';
import { FileText, Search } from 'lucide-react';

export const CheatsheetListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCheatsheets = contentService.getCheatsheets();

  const filteredCheatsheets = allCheatsheets.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTag = c.tags.some((t) => t.toLowerCase().includes(q));
      const matchCmd = c.sections.some((s) =>
        s.items.some((i) => i.command.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      );
      if (!matchTitle && !matchDesc && !matchTag && !matchCmd) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Cheat Sheets' }]} />

      <SectionHeader
        badge="Quick Reference Manuals"
        title="Searchable & Printable Security Cheat Sheets"
        subtitle="Fast, minimal command references for Linux, Nmap, Active Directory, Docker, Burp Suite, and Python."
      />

      {/* Search Input */}
      <div className="p-4 rounded-xl glass-panel border border-border mb-8 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search command one-liners (e.g., GetNPUsers, nmap -sC, docker inspect)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Cheatsheets Grid */}
      {filteredCheatsheets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <FileText className="w-8 h-8 text-amber-400/50 mx-auto" />
          <p>No cheat sheets match your search query &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCheatsheets.map((c) => (
            <CheatsheetCard key={c.id} cheatsheet={c} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
