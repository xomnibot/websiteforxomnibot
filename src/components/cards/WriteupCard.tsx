import React from 'react';
import { Link } from 'react-router-dom';
import { Writeup } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WriteupCardProps {
  writeup: Writeup;
}

export const WriteupCard: React.FC<WriteupCardProps> = ({ writeup }) => {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl glass-panel p-5 border border-border hover:border-emerald-500/40 transition-all duration-300 hover:shadow-cyber-glow">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              {writeup.platform}
            </span>
            <Tag difficulty={writeup.difficulty} variant="difficulty" size="sm">
              {writeup.difficulty}
            </Tag>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
            {formatDate(writeup.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
          <Link to={`/writeups/${writeup.slug}`}>
            <span className="absolute inset-0 z-10" />
            {writeup.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {writeup.summary}
        </p>
      </div>

      {/* Footer Meta & Tags */}
      <div className="mt-5 pt-4 border-t border-border/60 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5 z-20">
          {writeup.tags.slice(0, 3).map((tag, idx) => (
            <Tag key={idx} variant="gray" size="sm">
              #{tag}
            </Tag>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {writeup.readingTime}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
            Read Writeup
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
