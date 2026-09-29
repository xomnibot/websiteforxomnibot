export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, guard, json } from '../lib';

export const GET: APIRoute = ({ request, clientAddress }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const posts = [];
  for (const f of fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : []) {
    if (!/\.mdx?$/.test(f)) continue;
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1] ?? '';
    const get = (k: string) =>
      (new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(fm)?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
    posts.push({
      slug: f.replace(/\.mdx?$/, ''),
      file: f,
      title: get('title') || f,
      date: get('date'),
      draft: get('draft') === 'true',
    });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return json({ posts });
};
