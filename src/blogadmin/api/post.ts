export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { BLOG_DIR, MEDIA_DIR, guard, json, postPath, validSlug } from '../lib';

/** Split raw file into parsed frontmatter + body. */
function split(raw: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {} as Record<string, any>, body: raw };
  let data: Record<string, any> = {};
  try {
    data = (yaml.load(m[1]) as Record<string, any>) ?? {};
  } catch {}
  return { data, body: m[2] };
}

const q = (s: string) => JSON.stringify(s); // JSON strings are valid YAML

function isoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? '');
}

/** Convert Obsidian embeds ![[img.png]] / ![[img.png|alt]] to Markdown images. */
function convertObsidian(body: string, slug: string): string {
  return body.replace(/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_m, file: string, alt?: string) => {
    const name = path.basename(file.trim());
    const safe = name.replace(/[^A-Za-z0-9._-]+/g, '-');
    return `![${alt ?? name.replace(/\.[^.]+$/, '')}](/media/blog/${slug}/${safe})`;
  });
}

export const GET: APIRoute = ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const slug = url.searchParams.get('slug') ?? '';
  const p = postPath(slug);
  if (!p) return json({ error: 'not found' }, 404);
  const { data, body } = split(fs.readFileSync(p, 'utf8'));
  return json({
    slug,
    ext: path.extname(p),
    title: data.title ?? '',
    date: isoDate(data.date),
    description: data.description ?? data.summary ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    // fields we don't edit but must preserve
    extra: Object.fromEntries(
      Object.entries(data).filter(
        ([k]) => !['title', 'date', 'description', 'summary', 'tags', 'draft'].includes(k),
      ),
    ),
    body: body.replace(/^\r?\n/, ""),
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const b = await request.json().catch(() => null);
  if (!b || typeof b.title !== 'string' || !b.title.trim()) {
    return json({ error: 'title is required' }, 400);
  }
  if (!validSlug(b.slug)) return json({ error: 'invalid slug (a-z, 0-9, dashes)' }, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date ?? '')) return json({ error: 'date must be YYYY-MM-DD' }, 400);
  const existing = postPath(b.slug);
  // Renaming: caller passes previous slug so we don't leave duplicates.
  if (existing && b.originalSlug !== b.slug) return json({ error: 'a post with that slug already exists' }, 409);

  const tags = (Array.isArray(b.tags) ? b.tags : [])
    .map((t: unknown) => String(t).trim())
    .filter(Boolean);
  const lines = ['---', `title: ${q(b.title.trim())}`];
  if (b.description?.trim()) lines.push(`description: ${q(b.description.trim())}`);
  lines.push(`date: ${b.date}`);
  if (tags.length) lines.push(`tags: [${tags.map(q).join(', ')}]`);
  if (b.draft) lines.push('draft: true');
  const extra = b.extra && typeof b.extra === 'object' ? b.extra : {};
  if (Object.keys(extra).length) lines.push(yaml.dump(extra).trimEnd());
  lines.push('---', '');
  const body = convertObsidian(String(b.body ?? ''), b.slug).replace(/\s+$/, '') + '\n';

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  const ext = existing ? path.extname(existing) : b.originalSlug && postPath(b.originalSlug) ? path.extname(postPath(b.originalSlug)!) : '.md';
  const target = path.join(BLOG_DIR, b.slug + ext);
  fs.writeFileSync(target, lines.join('\n') + '\n' + body);

  // Slug rename: remove old file, move media folder.
  if (b.originalSlug && b.originalSlug !== b.slug) {
    const old = postPath(b.originalSlug);
    if (old) fs.rmSync(old);
    const oldMedia = path.join(MEDIA_DIR, b.originalSlug);
    if (validSlug(b.originalSlug) && fs.existsSync(oldMedia)) {
      fs.mkdirSync(MEDIA_DIR, { recursive: true });
      fs.renameSync(oldMedia, path.join(MEDIA_DIR, b.slug));
    }
    const fixed = fs.readFileSync(target, 'utf8').split(`/media/blog/${b.originalSlug}/`).join(`/media/blog/${b.slug}/`);
    fs.writeFileSync(target, fixed);
  }
  return json({ ok: true, file: `content/blog/${b.slug}${ext}`, body: fs.readFileSync(target, 'utf8').split(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)[1] ?? body });
};

export const DELETE: APIRoute = ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const slug = url.searchParams.get('slug') ?? '';
  const p = postPath(slug);
  if (!p) return json({ error: 'not found' }, 404);
  fs.rmSync(p);
  fs.rmSync(path.join(MEDIA_DIR, slug), { recursive: true, force: true });
  return json({ ok: true });
};
