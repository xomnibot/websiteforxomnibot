export const prerender = false;
import type { APIRoute } from 'astro';
import { createMarkdownProcessor, unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import { guard, json } from '../lib';

let proc: ReturnType<typeof createMarkdownProcessor> | undefined;
function processor() {
  return (proc ??= createMarkdownProcessor({
    processor: unified({ gfm: true, smartypants: true, rehypePlugins: [rehypeSlug] }),
  } as any));
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const { body = '', slug = '' } = await request.json().catch(() => ({}));
  const md = String(body).replace(
    /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g,
    (_m, f: string, alt?: string) =>
      `![${alt ?? f}](/media/blog/${slug}/${f.trim().replace(/[^A-Za-z0-9._-]+/g, '-')})`,
  );
  try {
    const r = await (await processor()).render(md);
    return json({ html: r.code });
  } catch (e) {
    return json({ html: `<pre>${String(e).replace(/</g, '&lt;')}</pre>` });
  }
};
