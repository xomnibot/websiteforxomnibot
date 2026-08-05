import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type CalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'note', title, children }) => {
  const getConfig = () => {
    switch (type) {
      case 'tip':
        return {
          icon: Lightbulb,
          border: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400',
          titleColor: 'text-emerald-400',
          defaultTitle: 'TIP',
        };
      case 'important':
        return {
          icon: AlertCircle,
          border: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400',
          titleColor: 'text-cyan-400',
          defaultTitle: 'IMPORTANT',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          border: 'border-amber-500/40 bg-amber-500/5 text-amber-400',
          titleColor: 'text-amber-400',
          defaultTitle: 'WARNING',
        };
      case 'caution':
        return {
          icon: ShieldAlert,
          border: 'border-rose-500/40 bg-rose-500/5 text-rose-400',
          titleColor: 'text-rose-400',
          defaultTitle: 'CAUTION',
        };
      case 'note':
      default:
        return {
          icon: Info,
          border: 'border-zinc-700 bg-zinc-800/40 text-zinc-300',
          titleColor: 'text-zinc-200',
          defaultTitle: 'NOTE',
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn('my-6 p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed', config.border)}>
      <IconComponent className={cn('w-5 h-5 shrink-0 mt-0.5', config.titleColor)} />
      <div className="space-y-1">
        <div className={cn('font-mono font-bold text-xs uppercase tracking-wider', config.titleColor)}>
          {title || config.defaultTitle}
        </div>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
};
