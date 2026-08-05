import React from 'react';
import { Link } from 'react-router-dom';
import { ResearchPaper } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ResearchCardProps {
  paper: ResearchPaper;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ paper }) => {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl glass-panel p-5 border border-border hover:border-cyan-500/40 transition-all duration-300 hover:shadow-cyan-glow">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <Tag variant="cyan" size="sm">
              {paper.category}
            </Tag>
            {paper.cve && (
              <span className="font-mono text-xs font-bold text-black bg-cyan-400 px-2 py-0.5 rounded whitespace-nowrap">
                {paper.cve}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
            {formatDate(paper.date)}
          </span>
        </div>

        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-cyan-400 transition-colors line-clamp-2">
          <Link to={`/research/${paper.slug}`}>
            <span className="absolute inset-0 z-10" />
            {paper.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {paper.summary}
        </p>

        {paper.impact && (
          <div className="mt-3 p-2.5 rounded bg-cyan-500/5 border border-cyan-500/10 text-xs font-mono text-cyan-300 flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">Impact: {paper.impact}</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5 z-20">
          {paper.tags.slice(0, 3).map((tag, idx) => (
            <Tag key={idx} variant="gray" size="sm">
              #{tag}
            </Tag>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {paper.readingTime}
          </span>
          <span className="inline-flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
            Read Paper
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
