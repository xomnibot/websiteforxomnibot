import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, entryHref, entryDescription } from '@/lib/collections';
import { siteConfig } from '@/lib/site';

export async function GET(context: APIContext) {
  const [writeups, research, blog, projects] = await Promise.all([
    getPublished('writeups'),
    getPublished('research'),
    getPublished('blog'),
    getPublished('projects'),
  ]);

  const items = [...writeups, ...research, ...blog, ...projects].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    site: context.site ?? new URL(siteConfig.url),
    items: items.map((entry) => ({
      title: entry.data.title,
      description: entryDescription(entry) || entry.data.title,
      link: entryHref(entry),
      pubDate: entry.data.date,
      categories: entry.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
