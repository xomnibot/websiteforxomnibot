import React from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'green' | 'cyan' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  variant = 'green',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-cyan-500 text-black hover:bg-cyan-400 focus:ring-cyan-400 shadow-cyan-500/20';
      case 'outline':
        return 'border border-emerald-500/40 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:border-emerald-500';
      case 'green':
      default:
        return 'bg-emerald-400 text-black hover:bg-emerald-300 focus:ring-emerald-400 shadow-emerald-500/20';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-mono';
      case 'lg':
        return 'px-6 py-3.5 text-base font-semibold';
      case 'md':
      default:
        return 'px-4.5 py-2.5 text-sm font-medium';
    }
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-sans transition-all duration-200 shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
