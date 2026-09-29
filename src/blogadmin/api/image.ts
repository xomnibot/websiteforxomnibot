export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { MEDIA_DIR, guard, json, safeFilename, validSlug } from '../lib';

const OK = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const slug = url.searchParams.get('slug') ?? '';
  if (!validSlug(slug)) return json({ error: 'set a valid slug first' }, 400);
  let name = safeFilename(url.searchParams.get('name') ?? 'image.png');
  if (!OK.has(path.extname(name).toLowerCase())) return json({ error: 'unsupported image type' }, 400);
  const buf = Buffer.from(await request.arrayBuffer());
  if (!buf.length || buf.length > 15 * 1024 * 1024) return json({ error: 'empty or >15MB' }, 400);
  const dir = path.join(MEDIA_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  // avoid overwriting a different file
  const ext = path.extname(name);
  const stem = name.slice(0, -ext.length);
  let i = 1;
  while (fs.existsSync(path.join(dir, name)) && !fs.readFileSync(path.join(dir, name)).equals(buf)) {
    name = `${stem}-${++i}${ext}`;
  }
  fs.writeFileSync(path.join(dir, name), buf);
  return json({ ok: true, url: `/media/blog/${slug}/${name}`, name });
};
