import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { TableOfContents, TOCItem } from '@/components/navigation/TableOfContents';
import { Callout } from '@/components/markdown/Callout';
import { contentService } from '@/services/contentService';
import { ShieldAlert, Clock, Calendar, Wrench, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { marked } from 'marked';

export const WriteupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const writeup = slug ? contentService.getWriteupBySlug(slug) : undefined;

  if (!writeup) {
    return (
      <PageContainer>
        <div className="text-center py-20 font-mono space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Writeup Not Found</h2>
          <p className="text-sm text-muted-foreground">The requested writeup slug &quot;{slug}&quot; does not exist.</p>
          <Link to="/writeups" className="inline-block text-emerald-400 hover:underline text-xs">
            ← Return to Writeups Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const tocItems: TOCItem[] = [
    { id: 'overview', text: 'Overview & Objectives', level: 2 },
    { id: 'prerequisites', text: 'Prerequisites & Tools', level: 2 },
    { id: 'reconnaissance', text: 'Reconnaissance & Exploitation', level: 2 },
    { id: 'mitigation', text: 'Defensive Remediation', level: 2 },
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Writeups', path: '/writeups' }, { label: writeup.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Article */}
        <article className="lg:col-span-8 space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                {writeup.platform}
              </span>
              <Tag difficulty={writeup.difficulty} variant="difficulty" size="sm">
                {writeup.difficulty}
              </Tag>
              <Tag variant="cyan" size="sm">
                {writeup.category}
              </Tag>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              {writeup.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {formatDate(writeup.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {writeup.readingTime}
              </span>
            </div>
          </div>

          {/* Objectives & Prerequisites Callout */}
          <div id="overview" className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-foreground">Overview & Learning Objectives</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {writeup.summary}
            </p>

            {writeup.objectives && writeup.objectives.length > 0 && (
              <div className="p-4 rounded-xl glass-panel border border-emerald-500/20 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Takeaways & Objectives
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {writeup.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Prerequisites & Tools */}
          {writeup.tools && writeup.tools.length > 0 && (
            <div id="prerequisites" className="space-y-3 pt-4">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" /> Required Tools & Frameworks
              </h2>
              <div className="flex flex-wrap gap-2">
                {writeup.tools.map((tool, idx) => (
                  <Tag key={idx} variant="gray" size="md">
                    {tool}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Main Body Markdown Content */}
          <div
            id="reconnaissance"
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 pt-4 text-muted-foreground border-t border-border"
            dangerouslySetInnerHTML={{ __html: marked.parse(writeup.content || '') }}
          />

          {/* Defensive Perspective */}
          <div id="mitigation" className="pt-6 border-t border-border space-y-3">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Defensive Remediation & Mitigations
            </h2>
            <Callout type="important" title="Security Hardening Guidance">
              Implement exact string validation for all registered OAuth redirect URIs and mandate Proof Key for Code Exchange (PKCE) across all client authentication flows.
            </Callout>
          </div>

          {/* Footer Back Link */}
          <div className="pt-8 border-t border-border flex items-center justify-between">
            <Link to="/writeups">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Writeups Directory
              </span>
            </Link>
          </div>
        </article>

        {/* Sidebar Table of Contents */}
        <aside className="lg:col-span-4">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </PageContainer>
  );
};
