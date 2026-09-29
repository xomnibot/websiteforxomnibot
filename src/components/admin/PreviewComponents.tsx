/**
 * React ports of src/components/mdx/*.astro, used ONLY to render the live
 * preview inside /admin (via @mdx-js/mdx `evaluate`). Styled identically to
 * the Astro originals — same Tailwind token classes — so the preview matches
 * the published page.
 */
import type { ReactNode } from 'react';
import { Info, Lightbulb, TriangleAlert, CircleAlert } from 'lucide-react';

type CalloutType = 'note' | 'tip' | 'warning' | 'danger' | 'info';

const CALLOUT_CONFIG: Record<CalloutType, { icon: typeof Info; classes: string; defaultTitle: string }> = {
  note: { icon: Info, classes: 'border-line-strong bg-surface', defaultTitle: 'Note' },
  info: { icon: Info, classes: 'border-blue/30 bg-blue/10', defaultTitle: 'Info' },
  tip: { icon: Lightbulb, classes: 'border-green/30 bg-green/10', defaultTitle: 'Tip' },
  warning: { icon: TriangleAlert, classes: 'border-amber/30 bg-amber/10', defaultTitle: 'Warning' },
  danger: { icon: CircleAlert, classes: 'border-red/30 bg-red/10', defaultTitle: 'Danger' },
};

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
}) {
  const { icon: Icon, classes, defaultTitle } = CALLOUT_CONFIG[type] ?? CALLOUT_CONFIG.note;
  return (
    <div className={`not-prose my-6 flex gap-3 rounded-xl border p-4 text-fg ${classes}`} role="note">
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="mb-1 font-semibold">{title ?? defaultTitle}</p>
        <div className="text-muted [&_a]:text-accent [&_a]:underline [&_code]:rounded [&_code]:bg-elevated [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-fg [&>*+*]:mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="not-prose my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full rounded-xl border border-line" />
      {caption && <figcaption className="mt-2 text-center text-sm text-subtle">{caption}</figcaption>}
    </figure>
  );
}

export function YouTube({ id, title }: { id: string; title: string }) {
  return (
    <div className="not-prose my-6 aspect-video overflow-hidden rounded-xl border border-line bg-surface">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export function Kbd({ children }: { children?: ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-md border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-xs text-fg shadow-[inset_0_-1px_0_var(--border-strong)]">
      {children}
    </kbd>
  );
}

export function Steps({ children }: { children?: ReactNode }) {
  return <div className="steps-list not-prose my-6">{children}</div>;
}

export const previewComponents = { Callout, Figure, YouTube, Kbd, Steps };
