import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BlogCard } from '@/components/cards/BlogCard';
import { contentService } from '@/services/contentService';
import { BookOpen, Search, Filter } from 'lucide-react';

const blogCategories = [
  'Career',
  'Study Methods',
  'Productivity',
  'Tool Reviews',
  'Opinions',
  'Conferences',
  'Event Recaps',
];

export const BlogListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = contentService.getBlogPosts();

  const filteredPosts = allPosts.filter((b) => {
    if (selectedCategory !== 'All' && b.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchSummary = b.summary.toLowerCase().includes(q);
      const matchTag = b.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTag) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Blog' }]} />

      <SectionHeader
        badge="Perspectives & Learning"
        title="Cybersecurity Blog & Study Strategies"
        subtitle="Insights on security methodology, career navigation, note-taking systems, and conference keynotes."
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
              placeholder="Search blog articles..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-emerald-400 text-black font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {blogCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  selectedCategory === c
                    ? 'bg-emerald-400 text-black font-semibold'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <BookOpen className="w-8 h-8 text-emerald-400/50 mx-auto" />
          <p>No blog posts match your current search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
