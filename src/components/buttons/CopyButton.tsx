import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className }) => {
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text)}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
      className={cn(
        'inline-flex items-center justify-center p-1.5 rounded-md text-xs font-mono transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/80 focus:outline-none focus:ring-1 focus:ring-primary',
        isCopied && 'text-emerald-400 bg-emerald-500/10',
        className
      )}
    >
      {isCopied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 mr-1" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};
