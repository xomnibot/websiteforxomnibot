import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { contentService } from '@/services/contentService';
import { BookOpen, Search, Filter } from 'lucide-react';

const categories = [
  'CVE Analysis',
  'Vulnerability Research',
  'Exploit Internals',
  'Patch Diffing',
  'Malware Analysis',
  'Browser Security',
  'AI Security',
];

export const ResearchListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (categoryParam) {
      const matched = categories.find((c) => c.toLowerCase() === categoryParam.toLowerCase());
      if (matched) {
        setSelectedCategory(matched);
      }
    }
  }, [categoryParam]);

  const allResearch = contentService.getResearchPapers();

  const filteredResearch = allResearch.filter((r) => {
    if (selectedCategory !== 'All' && r.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchSummary = r.summary.toLowerCase().includes(q);
      const matchCVE = r.cve ? r.cve.toLowerCase().includes(q) : false;
      const matchTag = r.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchCVE && !matchTag) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Research' }]} />

      <SectionHeader
        badge="Technical Publications"
        title="Cybersecurity Research & CVE Analysis"
        subtitle="Original vulnerability research, kernel exploit primitives, browser internals, patch diffing, and AI security auditing."
      />

      {/* Filters */}
      <div className="p-5 rounded-xl glass-panel border border-border space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CVE, kernel, V8, AI prompt injection..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-cyan-400 text-black font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  selectedCategory === c
                    ? 'bg-cyan-400 text-black font-semibold'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Research Grid */}
      {filteredResearch.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <BookOpen className="w-8 h-8 text-cyan-400/50 mx-auto" />
          <p>No research papers match your current query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResearch.map((r) => (
            <ResearchCard key={r.id} paper={r} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
