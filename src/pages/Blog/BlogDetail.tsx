import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { TableOfContents, TOCItem } from '@/components/navigation/TableOfContents';
import { contentService } from '@/services/contentService';
import { BookOpen, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? contentService.getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <PageContainer>
        <div className="text-center py-20 font-mono space-y-4">
          <BookOpen className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Article Not Found</h2>
          <p className="text-sm text-muted-foreground">The requested blog post &quot;{slug}&quot; does not exist.</p>
          <Link to="/blog" className="inline-block text-emerald-400 hover:underline text-xs">
            ← Return to Blog Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const tocItems: TOCItem[] = [
    { id: 'intro', text: 'Introduction & Core Strategy', level: 2 },
    { id: 'methodology', text: 'Workflow Pillars', level: 2 },
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: post.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-8">
          <div className="space-y-4 pb-6 border-b border-border">
            <Tag variant="green" size="sm">
              {post.category}
            </Tag>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {formatDate(post.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {post.readingTime}
              </span>
            </div>
          </div>

          <div id="intro" className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              {post.summary}
            </p>
          </div>

          <div id="methodology" className="space-y-4 pt-4 border-t border-border prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Developing a consistent research habit requires removing friction from note-taking and target tracking:
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Maintain immutable command logs for every active terminal session.</li>
              <li>Tag vulnerability types consistently across personal knowledge bases.</li>
              <li>Automate passive sub-domain discovery pipelines.</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-border">
            <Link to="/blog">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog Directory
              </span>
            </Link>
          </div>
        </article>

        <aside className="lg:col-span-4">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </PageContainer>
  );
};
