import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { TableOfContents, TOCItem } from '@/components/navigation/TableOfContents';
import { contentService } from '@/services/contentService';
import { BookOpen, Clock, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { marked } from 'marked';

export const ResearchDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const paper = slug ? contentService.getResearchBySlug(slug) : undefined;

  if (!paper) {
    return (
      <PageContainer>
        <div className="text-center py-20 font-mono space-y-4">
          <BookOpen className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Research Paper Not Found</h2>
          <p className="text-sm text-muted-foreground">The requested research paper &quot;{slug}&quot; does not exist.</p>
          <Link to="/research" className="inline-block text-cyan-400 hover:underline text-xs">
            ← Return to Research Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const tocItems: TOCItem[] = [
    { id: 'summary', text: 'Executive Summary', level: 2 },
    { id: 'root-cause', text: 'Root Cause Analysis', level: 2 },
    { id: 'exploitation', text: 'Exploit Construction', level: 2 },
    { id: 'patch', text: 'Patch Verification', level: 2 },
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Research', path: '/research' }, { label: paper.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="cyan" size="sm">
                {paper.category}
              </Tag>
              {paper.cve && (
                <span className="font-mono text-xs font-bold text-black bg-cyan-400 px-2.5 py-0.5 rounded">
                  {paper.cve}
                </span>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              {paper.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {formatDate(paper.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {paper.readingTime}
              </span>
            </div>
          </div>

          {/* Impact Banner */}
          {paper.impact && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs sm:text-sm font-mono text-cyan-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-400 uppercase">Impact Assessment: </span>
                <span>{paper.impact}</span>
                {paper.affectedSystems && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Target Systems: {paper.affectedSystems}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 1: Executive Summary */}
          <div id="summary" className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-foreground">Executive Summary</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {paper.summary}
            </p>
          </div>

          {/* Section 2: Content Body */}
          <div
            id="root-cause"
            className="space-y-4 pt-4 border-t border-border prose dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: marked.parse(paper.content || '') }}
          />

          <div className="pt-8 border-t border-border">
            <Link to="/research">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Research Directory
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
