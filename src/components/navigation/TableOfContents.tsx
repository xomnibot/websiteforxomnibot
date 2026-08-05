import React from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const itemIds = items.map((item) => item.id);
  const activeId = useScrollSpy(itemIds, 120);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-24 p-4 rounded-xl glass-panel border border-border">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border text-xs font-mono font-semibold tracking-wider text-muted-foreground uppercase">
        <List className="w-4 h-4 text-emerald-400" />
        <span>Table of Contents</span>
      </div>
      <nav className="space-y-1.5 text-xs font-sans">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'block transition-all duration-150 truncate py-1 border-l-2 pl-3',
                item.level === 3 && 'ml-3',
                isActive
                  ? 'border-emerald-400 text-emerald-400 font-medium bg-emerald-500/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-zinc-500'
              )}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
