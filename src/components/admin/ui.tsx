/**
 * Small shared UI primitives for the /admin React app. Plain Tailwind
 * classes using the site's design tokens (bg-elevated, border-line, accent,
 * etc. — see src/styles/global.css / FOUNDATION_NOTES) since these are React
 * components and can't import the .astro primitives in src/components/ui/.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, X, Check, Loader2, AlertTriangle, Info, CircleCheck } from 'lucide-react';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-accent-fg hover:opacity-90',
    secondary: 'border border-line-strong bg-elevated text-fg hover:border-accent/50 hover:bg-surface',
    ghost: 'text-fg hover:bg-surface',
    danger: 'border border-red/30 bg-red/10 text-red hover:bg-red/20',
  };
  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-fg">
        <span>
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-subtle">{hint}</span>}
      </label>
      <FieldContext.Provider value={id}>{children}</FieldContext.Provider>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red">
          <AlertTriangle className="size-3" /> {error}
        </p>
      )}
    </div>
  );
}

import { createContext, useContext } from 'react';
const FieldContext = createContext<string | undefined>(undefined);
function useFieldId() {
  return useContext(FieldContext);
}

const inputBase =
  'h-10 w-full rounded-lg border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

export function TextInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useFieldId();
  return <input id={id} className={cn(inputBase, className)} {...rest} />;
}

export function TextArea({
  className,
  rows = 4,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useFieldId();
  return (
    <textarea
      id={id}
      rows={rows}
      className={cn(
        'w-full resize-y rounded-lg border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
      {...rest}
    />
  );
}

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useFieldId();
  return (
    <div className="relative">
      <select
        id={id}
        className={cn(inputBase, 'appearance-none pr-8', className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
    </div>
  );
}

/** Select with a built-in "Custom…" option that reveals a text input. */
export function SelectWithCustom({
  value,
  onChange,
  options,
  placeholder = 'Custom…',
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  const isCustom = value !== '' && !options.includes(value);
  const [custom, setCustom] = useState(isCustom);
  return (
    <div className="flex flex-col gap-2">
      <Select
        value={custom ? '__custom__' : value}
        onChange={(e) => {
          if (e.target.value === '__custom__') {
            setCustom(true);
            onChange('');
          } else {
            setCustom(false);
            onChange(e.target.value);
          }
        }}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value="__custom__">Custom…</option>
      </Select>
      {custom && (
        <TextInput value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-line bg-elevated px-3 py-2.5">
      <span className="flex flex-col">
        <span className="text-sm font-medium text-fg">{label}</span>
        {description && <span className="text-xs text-subtle">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-surface border border-line-strong transition-colors peer-checked:border-accent peer-checked:bg-accent/80" />
        <span className="absolute left-0.5 size-4 rounded-full bg-subtle transition-transform peer-checked:translate-x-4 peer-checked:bg-accent-fg" />
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Chip input (tags, tools)
// ---------------------------------------------------------------------------
export function ChipInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const id = useFieldId();

  function commit() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft('');
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-elevated px-2 py-1.5 focus-within:ring-2 focus-within:ring-accent">
      {values.map((v, i) => (
        <span
          key={`${v}-${i}`}
          className="inline-flex items-center gap-1 rounded-md border border-line-strong bg-surface px-2 py-0.5 font-mono text-xs text-fg"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            className="text-subtle hover:text-red"
            aria-label={`Remove ${v}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length ? '' : placeholder}
        className="min-w-[8ch] flex-1 bg-transparent py-1 text-sm text-fg placeholder:text-subtle focus-visible:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// List input (objectives, tools, install steps — one per line)
// ---------------------------------------------------------------------------
export function ListInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const items = values.length ? values : [''];
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <TextInput
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 px-2"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label="Remove item"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => onChange([...items, ''])}>
        + Add
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible "advanced fields" section
// ---------------------------------------------------------------------------
export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-muted hover:text-fg"
      >
        {title}
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="flex flex-col gap-4 border-t border-line p-3">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
export interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastCounter = 0;
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  function push(type: ToastItem['type'], message: string) {
    const id = ++toastCounter;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }
  function dismiss(id: number) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }
  return { toasts, push, dismiss };
}

export function ToastHost({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: number) => void }) {
  const icons = { success: CircleCheck, error: AlertTriangle, info: Info };
  const tones = {
    success: 'border-green/30 bg-green/10 text-green',
    error: 'border-red/30 bg-red/10 text-red',
    info: 'border-blue/30 bg-blue/10 text-blue',
  };
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-2 rounded-lg border bg-elevated p-3 text-sm shadow-lg',
              tones[t.type],
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span className="flex-1 text-fg">{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-subtle hover:text-fg">
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('animate-spin', className)} />;
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'accent' | 'green' | 'amber' | 'orange' | 'red' | 'blue';
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'border-line bg-surface text-muted',
    accent: 'border-accent/30 bg-accent/10 text-accent',
    green: 'border-green/30 bg-green/10 text-green',
    amber: 'border-amber/30 bg-amber/10 text-amber',
    orange: 'border-orange/30 bg-orange/10 text-orange',
    red: 'border-red/30 bg-red/10 text-red',
    blue: 'border-blue/30 bg-blue/10 text-blue',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StepDot({ done, active, label }: { done?: boolean; active?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]',
          done ? 'border-accent bg-accent text-accent-fg' : active ? 'border-accent text-accent' : 'border-line-strong text-subtle',
        )}
      >
        {done ? <Check className="size-3" /> : null}
      </span>
      <span className={cn(active ? 'text-fg' : 'text-subtle')}>{label}</span>
    </div>
  );
}

export function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}
