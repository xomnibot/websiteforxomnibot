import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { GhostButton } from '@/components/buttons/GhostButton';
import { CodeBlock } from '@/components/markdown/CodeBlock';
import { TableOfContents, TOCItem } from '@/components/navigation/TableOfContents';
import { contentService } from '@/services/contentService';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Code2, Star, CheckCircle, ArrowLeft, Terminal } from 'lucide-react';
import { marked } from 'marked';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? contentService.getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <PageContainer>
        <div className="text-center py-20 font-mono space-y-4">
          <Code2 className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Project Not Found</h2>
          <p className="text-sm text-muted-foreground">The requested project slug &quot;{slug}&quot; does not exist.</p>
          <Link to="/projects" className="inline-block text-purple-400 hover:underline text-xs">
            ← Return to Projects Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const tocItems: TOCItem[] = [
    { id: 'overview', text: 'Project Overview', level: 2 },
    { id: 'features', text: 'Key Features', level: 2 },
    { id: 'installation', text: 'Installation & Quickstart', level: 2 },
    { id: 'roadmap', text: 'Development Roadmap', level: 2 },
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Projects', path: '/projects' }, { label: project.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tag variant="cyan" size="sm">
                  {project.category}
                </Tag>
                <Tag variant="gray" size="sm">
                  {project.language}
                </Tag>
                <span className="text-xs font-mono text-muted-foreground">
                  License: {project.license}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {project.stars !== undefined && (
                  <span className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {project.stars} Stars
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
              {project.title}
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <PrimaryButton icon={<GithubIcon className="w-4 h-4" />}>
                  View Repository on GitHub
                </PrimaryButton>
              </a>
              {project.docsUrl && (
                <a href={project.docsUrl} target="_blank" rel="noreferrer">
                  <GhostButton icon={<Code2 className="w-4 h-4" />}>
                    Documentation
                  </GhostButton>
                </a>
              )}
            </div>
          </div>

          {/* Section 1: Overview */}
          <div id="overview" className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-foreground">Project Overview</h2>
            <div
              className="text-sm text-muted-foreground leading-relaxed space-y-3 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: marked.parse(project.content || '') }}
            />
          </div>

          {/* Section 2: Features */}
          <div id="features" className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-bold font-heading text-foreground">Key Architecture & Capabilities</h2>
            <div className="grid grid-cols-1 gap-3">
              {project.features.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl glass-panel border border-border flex items-start gap-3 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Installation */}
          <div id="installation" className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" /> Installation & Quickstart
            </h2>
            <CodeBlock
              language="bash"
              filename="install.sh"
              code={project.installation.join('\n')}
            />
          </div>

          {/* Section 4: Roadmap */}
          {project.roadmap && project.roadmap.length > 0 && (
            <div id="roadmap" className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-xl font-bold font-heading text-foreground">Development Roadmap</h2>
              <div className="space-y-2">
                {project.roadmap.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-border text-xs font-mono">
                    <span className="text-foreground">{item.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded capitalize ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'in-progress'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-border">
            <Link to="/projects">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-purple-400 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Directory
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
