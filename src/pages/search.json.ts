/**
 * Static search index consumed by the Cmd/Ctrl+K palette
 * (`src/components/search/SearchPalette.tsx`). Prerendered at build time —
 * `output: 'static'` already prerenders every route, `prerender = true` is
 * just explicit about intent.
 *
 * One entry per published content-collection item, plus a handful of
 * hand-written entries for static pages (About, Contact, YouTube, Tags).
 */
import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { getAllPublished, entryDescription, entryHref, type AnyEntry } from '@/lib/collections';
import { stripMarkdown } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import type { SearchEntry } from '@/components/search/search-types';

export const prerender = true;

/** Keeps the generated JSON small; commands inside cheatsheet code fences
 * are appended explicitly below (stripMarkdown drops fenced code). */
const TEXT_CAP = 3000;

function buildText(entry: AnyEntry): string {
  let text = stripMarkdown(entry.body ?? '');

  if (entry.collection === 'cheatsheets') {
    const sectionsText = entry.data.sections
      .flatMap((section) => [
        section.title,
        ...section.items.flatMap((item) => [item.command, item.description, item.example ?? '']),
      ])
      .filter(Boolean)
      .join(' ');
    text = `${text} ${sectionsText}`.trim();
  }

  return text.length > TEXT_CAP ? text.slice(0, TEXT_CAP) : text;
}

async function toSearchEntry(entry: AnyEntry): Promise<SearchEntry> {
  const { headings } = await render(entry);

  const result: SearchEntry = {
    title: entry.data.title,
    description: entryDescription(entry),
    href: entryHref(entry),
    collection: entry.collection,
    category: entry.data.category,
    tags: entry.data.tags,
    date: new Date(entry.data.date).toISOString(),
    // `h.text` includes the trailing "#" anchor-link content that
    // rehype-autolink-headings appends onto each heading node (the same
    // node Astro's `render()` extracts `headings` from) — strip it here so
    // it doesn't pollute matching/highlighting.
    headings: headings.map((h) => h.text.replace(/#+\s*$/, '').trim()).filter(Boolean),
    text: buildText(entry),
  };

  if (entry.collection === 'writeups') {
    result.platform = entry.data.platform;
    result.difficulty = entry.data.difficulty;
  }
  if (entry.collection === 'research') {
    result.cve = entry.data.cve;
  }

  return result;
}

/** Static, non-collection pages — hand-written so they're searchable too. */
function staticPageEntries(): SearchEntry[] {
  const buildDate = new Date().toISOString();

  return [
    {
      title: 'About',
      description: `${siteConfig.persona.role} — ${siteConfig.tagline}`,
      href: '/about',
      collection: 'page',
      tags: [],
      date: buildDate,
      headings: [],
      text: [
        siteConfig.description,
        siteConfig.mission,
        siteConfig.persona.role,
        siteConfig.persona.favoriteOS,
        siteConfig.persona.rig.os,
        siteConfig.persona.rig.terminal,
        siteConfig.persona.rig.editor,
        ...siteConfig.persona.primaryLanguages,
        ...siteConfig.persona.favoriteSecurityTools,
        ...siteConfig.persona.funFacts,
        ...Object.values(siteConfig.skills).flat(),
      ].join(' '),
    },
    {
      title: 'Contact',
      description: `Get in touch with ${siteConfig.persona.handle} — email, GitHub, LinkedIn, X.`,
      href: '/contact',
      collection: 'page',
      tags: [],
      date: buildDate,
      headings: [],
      text: `Contact email GitHub LinkedIn X Twitter ${siteConfig.socials.email} ${siteConfig.socials.github} ${siteConfig.socials.linkedin} ${siteConfig.socials.x}`,
    },
    {
      title: 'YouTube',
      description: `Videos from ${siteConfig.persona.handle} — ${siteConfig.currentFocus.nextVideo}.`,
      href: '/youtube',
      collection: 'page',
      tags: [],
      date: buildDate,
      headings: [],
      text: `YouTube channel videos uploads ${siteConfig.currentFocus.nextVideo}`,
    },
    {
      title: 'Tags',
      description: 'Browse every writeup, research post, project, blog post, and cheatsheet by tag.',
      href: '/tags',
      collection: 'page',
      tags: [],
      date: buildDate,
      headings: [],
      text: 'Tags browse all tags topics categories index',
    },
  ];
}

export const GET: APIRoute = async () => {
  const published = await getAllPublished();
  const contentEntries = await Promise.all(published.map(toSearchEntry));
  const index: SearchEntry[] = [...contentEntries, ...staticPageEntries()];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
