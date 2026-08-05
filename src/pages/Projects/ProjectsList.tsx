import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { contentService } from '@/services/contentService';
import { Code2, Search, Filter } from 'lucide-react';

const projectCategories = [
  'AI Tools',
  'Security Tools',
  'CLI Tools',
  'Browser Extensions',
  'Automation',
  'Research Projects',
];

export const ProjectsListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allProjects = contentService.getProjects();

  const filteredProjects = allProjects.filter((p) => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Projects' }]} />

      <SectionHeader
        badge="Open Source Security Tools"
        title="Software Projects & Open Source Repositories"
        subtitle="AI binary vulnerability analyzers, Active Directory Kerberos roasting tools, and Burp Suite extensions."
      />

      {/* Filter Toolbar */}
      <div className="p-5 rounded-xl glass-panel border border-border space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python, Rust, AI tools..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-purple-400" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-purple-400 text-black font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {projectCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  selectedCategory === c
                    ? 'bg-purple-400 text-black font-semibold'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <Code2 className="w-8 h-8 text-purple-400/50 mx-auto" />
          <p>No project repositories match your current filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
