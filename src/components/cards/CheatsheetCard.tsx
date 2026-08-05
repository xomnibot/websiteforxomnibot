import React from 'react';
import { Link } from 'react-router-dom';
import { Cheatsheet } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { FileText, ArrowRight, Terminal } from 'lucide-react';

interface CheatsheetCardProps {
  cheatsheet: Cheatsheet;
}

export const CheatsheetCard: React.FC<CheatsheetCardProps> = ({ cheatsheet }) => {
  const totalCommands = cheatsheet.sections.reduce((acc, sec) => acc + sec.items.length, 0);

  return (
    <article className="group relative flex flex-col justify-between rounded-xl glass-panel p-5 border border-border hover:border-amber-500/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Tag variant="cyan" size="sm">
            {cheatsheet.category}
          </Tag>
          <span className="flex items-center gap-1 text-xs font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Terminal className="w-3 h-3" />
            {totalCommands} Commands
          </span>
        </div>

        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-amber-400 transition-colors">
          <Link to={`/cheatsheets/${cheatsheet.slug}`}>
            <span className="absolute inset-0 z-10" />
            {cheatsheet.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {cheatsheet.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5 z-20">
          {cheatsheet.tags.slice(0, 3).map((tag, idx) => (
            <Tag key={idx} variant="gray" size="sm">
              #{tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          Printable Guide
        </span>
        <span className="inline-flex items-center gap-1 text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
          Open Sheet
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
