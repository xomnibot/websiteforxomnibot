import fs from 'node:fs';
import path from 'node:path';

export const ROOT = process.cwd();
export const BLOG_DIR = path.join(ROOT, 'content', 'blog');
export const MEDIA_DIR = path.join(ROOT, 'public', 'media', 'blog');

const LOCAL = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost']);

/** Defence in depth: refuse anything that is not clearly localhost. */
export function guard(request: Request, clientAddress?: string): Response | null {
  let host = '';
  try {
    host = new URL(request.url).hostname.replace(/^\[|\]$/g, '');
  } catch {}
  let addr = '';
  try {
    addr = clientAddress ?? '';
  } catch {}
  const hostOk = LOCAL.has(host);
  const addrOk = !addr || LOCAL.has(addr);
  if (!hostOk || !addrOk) return json({ error: 'blogadmin is localhost only' }, 403);
  // CSRF: browsers send Origin on cross-site POSTs; require it to be local too.
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (!LOCAL.has(new URL(origin).hostname.replace(/^\[|\]$/g, ''))) {
        return json({ error: 'bad origin' }, 403);
      }
    } catch {
      return json({ error: 'bad origin' }, 403);
    }
  }
  return null;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export function validSlug(s: unknown): s is string {
  return typeof s === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,80})$/.test(s);
}

export function postPath(slug: string): string | null {
  if (!validSlug(slug)) return null;
  for (const ext of ['.md', '.mdx']) {
    const p = path.join(BLOG_DIR, slug + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function safeFilename(name: string): string {
  const base = path.basename(name).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^\.+/, '');
  return base || 'image.png';
}
