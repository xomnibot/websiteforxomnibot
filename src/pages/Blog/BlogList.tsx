import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BlogCard } from '@/components/cards/BlogCard';
import { contentService } from '@/services/contentService';
import { BookOpen, Search } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = contentService.getBlogPosts();

  const filteredPosts = allPosts.filter((b) => {
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

      {/* Search Input Box */}
      <div className="p-4 rounded-xl glass-panel border border-border mb-8 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog articles..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm space-y-2">
          <BookOpen className="w-8 h-8 text-emerald-400/50 mx-auto" />
          <p>No blog posts match your current search query &quot;{searchQuery}&quot;.</p>
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
