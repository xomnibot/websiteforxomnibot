import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  centered = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4',
        centered && 'items-center text-center justify-center',
        className
      )}
    >
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-1 mb-2 text-xs font-mono font-medium tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded uppercase">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
