/**
 * Live preview tab: renders the post body with @mdx-js/mdx `evaluate`
 * (react/jsx-runtime) using React ports of the site's MDX components, inside
 * the same `.prose` classes the site uses. Rewritten `/media/...` image
 * paths are swapped for local blob object URLs so screenshots show before
 * anything is published. Also renders a small card preview (title,
 * description, cover, badges) matching PostCard styling.
 */
import { useEffect, useMemo, useState } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import type { ComponentType } from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { previewComponents } from './PreviewComponents';
import { loadGfmPlugin } from './lib/mdx';
import { stripMarkdown, readingTime, formatDate } from '@/lib/utils';
import { difficultyTone, severityTone, statusTone } from '@/lib/badges';
import type { AdminFormState } from './lib/formData';
import type { UploadedImage } from './lib/types';
import type { CollectionKey } from '@/lib/schemas';
import { Badge } from './ui';

function localizeMediaPaths(body: string, collection: CollectionKey, slug: string, images: UploadedImage[]): string {
  let out = body;
  for (const img of images) {
    const target = `/media/${collection}/${slug}/${img.filename}`;
    out = out.split(target).join(img.previewUrl);
  }
  return out;
}

function resolveCoverPreview(cover: string, images: UploadedImage[]): string | null {
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  const match = images.find((img) => cover.endsWith(img.filename) || cover === img.filename);
  if (match) return match.previewUrl;
  if (cover.startsWith('/')) return cover; // existing /media/ path (edit mode), served by the live site
  return null;
}

export function PreviewPane({
  collection,
  slug,
  body,
  format,
  images,
  form,
}: {
  collection: CollectionKey;
  slug: string;
  body: string;
  format: 'md' | 'mdx';
  images: UploadedImage[];
  form: AdminFormState;
}) {
  const [Content, setContent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const localizedBody = useMemo(() => localizeMediaPaths(body, collection, slug, images), [body, collection, slug, images]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const remarkGfm = await loadGfmPlugin();
        const mod = await evaluate(localizedBody, {
          ...jsxRuntime,
          format,
          remarkPlugins: remarkGfm ? [remarkGfm as never] : [],
          useMDXComponents: () => previewComponents,
        } as never);
        if (!cancelled) {
          setContent(() => mod.default as ComponentType);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setContent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [localizedBody, format]);

  const description = form.description.trim() || truncatedFirstParagraph(body);
  const coverPreview = resolveCoverPreview(form.cover, images);
  const rtime = readingTime(body);
  const difficulty = String(form.extras.difficulty ?? '');
  const severity = String(form.extras.severity ?? '');
  const status = String(form.extras.status ?? '');

  return (
    <div className="flex flex-col gap-6">
      {/* Card preview */}
      <div className="rounded-xl border border-line bg-elevated p-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">// card preview</p>
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          {coverPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreview} alt={form.coverAlt || form.title} className="aspect-video w-full object-cover" />
          )}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {collection === 'writeups' && difficulty && <Badge tone={difficultyTone(difficulty)}>{difficulty}</Badge>}
              {collection === 'research' && severity && <Badge tone={severityTone(severity)}>{severity}</Badge>}
              {collection === 'projects' && status && <Badge tone={statusTone(status)}>{status}</Badge>}
              {form.featured && <Badge tone="accent">Featured</Badge>}
              {form.draft && <Badge tone="amber">Draft</Badge>}
            </div>
            <h3 className="font-semibold text-fg">{form.title || 'Untitled post'}</h3>
            <p className="text-sm text-muted">{description || 'No description yet.'}</p>
            <div className="flex items-center gap-3 font-mono text-xs text-subtle">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" /> {form.date ? formatDate(form.date) : '—'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" /> {rtime}
              </span>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.tags.map((t) => (
                  <span key={t} className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body preview */}
      <div className="rounded-xl border border-line bg-elevated p-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">// body preview</p>
        {loading && <p className="text-sm text-subtle">Rendering…</p>}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red/30 bg-red/10 p-3 text-sm text-red">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Couldn't render preview</p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{error}</pre>
            </div>
          </div>
        )}
        {!loading && !error && Content && (
          <div className="prose max-w-none">
            <h1 className="!mb-4">{form.title || 'Untitled post'}</h1>
            <Content />
          </div>
        )}
      </div>
    </div>
  );
}

function truncatedFirstParagraph(body: string): string {
  const plain = stripMarkdown(body ?? '');
  const para = plain.split(/\n{2,}/).find((p) => p.trim().length > 0) ?? '';
  const clean = para.trim();
  if (clean.length <= 160) return clean;
  const cut = clean.slice(0, 160);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : 160)}…`;
}
