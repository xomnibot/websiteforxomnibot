import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { CopyButton } from '@/components/buttons/CopyButton';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { contentService } from '@/services/contentService';
import { FileText, Printer, ArrowLeft, Terminal } from 'lucide-react';

export const CheatsheetDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const cheatsheet = slug ? contentService.getCheatsheetBySlug(slug) : undefined;

  if (!cheatsheet) {
    return (
      <PageContainer>
        <div className="text-center py-20 font-mono space-y-4">
          <FileText className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Cheat Sheet Not Found</h2>
          <p className="text-sm text-muted-foreground">The requested cheat sheet slug &quot;{slug}&quot; does not exist.</p>
          <Link to="/cheatsheets" className="inline-block text-amber-400 hover:underline text-xs">
            ← Return to Cheat Sheets Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer>
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: 'Cheat Sheets', path: '/cheatsheets' }, { label: cheatsheet.title }]} />
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag variant="cyan" size="sm">
                {cheatsheet.category}
              </Tag>
              <span className="text-xs font-mono text-muted-foreground">
                Updated: {cheatsheet.lastUpdated}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
              {cheatsheet.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {cheatsheet.description}
            </p>
          </div>

          <div className="print:hidden shrink-0">
            <PrimaryButton
              variant="outline"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </PrimaryButton>
          </div>
        </div>

        {/* Sections & Commands */}
        <div className="space-y-8">
          {cheatsheet.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                {section.title}
              </h2>

              <div className="space-y-3">
                {section.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-4 rounded-xl glass-panel border border-border space-y-2 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-sans text-muted-foreground">{item.description}</p>
                      <div className="print:hidden">
                        <CopyButton text={item.command} />
                      </div>
                    </div>

                    <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-amber-300 overflow-x-auto">
                      <code>{item.command}</code>
                    </pre>

                    {item.example && (
                      <div className="text-[11px] font-mono text-zinc-500 pt-1">
                        Example: <code className="text-zinc-400">{item.example}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="print:hidden pt-8 border-t border-border">
          <Link to="/cheatsheets">
            <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cheat Sheets Directory
            </span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
