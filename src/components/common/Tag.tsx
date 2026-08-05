import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'green' | 'cyan' | 'gray' | 'difficulty';
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'green',
  difficulty,
  size = 'sm',
  onClick,
  className,
}) => {
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'Medium':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'Hard':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-400';
      case 'Insane':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      default:
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    }
  };

  const getVariantStyles = () => {
    if (variant === 'difficulty' && difficulty) {
      return getDifficultyColor(difficulty);
    }
    switch (variant) {
      case 'cyan':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 dark:text-cyan-300';
      case 'gray':
        return 'border-zinc-700 bg-zinc-800/60 text-zinc-300 dark:text-zinc-400';
      case 'green':
      default:
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 dark:text-emerald-300';
    }
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-mono font-medium rounded border transition-all duration-200 whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        onClick && 'cursor-pointer hover:opacity-80 hover:scale-105',
        getVariantStyles(),
        className
      )}
    >
      {children}
    </span>
  );
};
