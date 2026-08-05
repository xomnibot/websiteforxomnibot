import { Writeup, ResearchPaper, Project, BlogPost, Cheatsheet } from '@/types/content';

export interface ParsedMarkdown<T = Record<string, any>> {
  metadata: T;
  content: string;
}

export function parseFrontmatter<T = Record<string, any>>(rawMarkdown: string): ParsedMarkdown<T> {
  const match = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {} as T, content: rawMarkdown.trim() };
  }

  const yamlStr = match[1];
  const content = match[2].trim();
  const metadata: Record<string, any> = {};

  let currentKey: string | null = null;
  let currentList: string[] | null = null;

  yamlStr.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && currentKey) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      if (!currentList) currentList = [];
      currentList.push(val);
      metadata[currentKey] = currentList;
      return;
    }

    currentList = null;
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let rawVal = line.slice(colonIdx + 1).trim();

      if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
        rawVal = rawVal.slice(1, -1);
      }

      if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        try {
          metadata[key] = JSON.parse(rawVal);
        } catch {
          metadata[key] = rawVal
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        }
      } else if (rawVal === 'true') {
        metadata[key] = true;
      } else if (rawVal === 'false') {
        metadata[key] = false;
      } else if (!isNaN(Number(rawVal)) && rawVal !== '') {
        metadata[key] = Number(rawVal);
      } else {
        metadata[key] = rawVal;
        currentKey = key;
      }
    }
  });

  return { metadata: metadata as T, content };
}

// Loaders for each content type supporting subfolders & .md / .mdx
export function loadWriteupsFromMarkdown(): Writeup[] {
  const files = import.meta.glob<string>(
    ['/src/content/writeups/**/*.{md,mdx}', '/content/writeups/**/*.{md,mdx}', '/content/writeup/**/*.{md,mdx}'],
    { query: '?raw', eager: true, import: 'default' }
  );

  return Object.entries(files).map(([filepath, rawContent]) => {
    const segments = filepath.split('/');
    const filename = segments.pop()?.replace(/\.(md|mdx)$/, '') || '';
    const parentFolder = segments.pop() || '';
    const fallbackSlug = filename === 'index' ? parentFolder : filename;

    const { metadata, content } = parseFrontmatter<Record<string, any>>(rawContent);

    return {
      id: metadata.id || metadata.slug || fallbackSlug,
      title: metadata.title || fallbackSlug,
      slug: metadata.slug || fallbackSlug,
      date: String(metadata.date || new Date().toISOString().split('T')[0]),
      platform: (metadata.platform as any) || 'TryHackMe',
      difficulty: (metadata.difficulty as any) || 'Easy',
      category: metadata.category || 'General',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      summary: metadata.summary || metadata.description || '',
      readingTime: metadata.readingTime || '5 min read',
      featuredImage: metadata.featuredImage,
      featured: Boolean(metadata.featured),
      content,
      objectives: Array.isArray(metadata.objectives) ? metadata.objectives : [],
      prerequisites: Array.isArray(metadata.prerequisites) ? metadata.prerequisites : [],
      tools: Array.isArray(metadata.tools) ? metadata.tools : [],
    };
  });
}

export function loadResearchFromMarkdown(): ResearchPaper[] {
  const files = import.meta.glob<string>(
    ['/src/content/research/**/*.{md,mdx}', '/content/research/**/*.{md,mdx}'],
    { query: '?raw', eager: true, import: 'default' }
  );

  return Object.entries(files).map(([filepath, rawContent]) => {
    const segments = filepath.split('/');
    const filename = segments.pop()?.replace(/\.(md|mdx)$/, '') || '';
    const parentFolder = segments.pop() || '';
    const fallbackSlug = filename === 'index' ? parentFolder : filename;

    const { metadata, content } = parseFrontmatter<Partial<ResearchPaper>>(rawContent);

    return {
      id: metadata.id || metadata.slug || fallbackSlug,
      title: metadata.title || fallbackSlug,
      slug: metadata.slug || fallbackSlug,
      date: String(metadata.date || new Date().toISOString().split('T')[0]),
      cve: metadata.cve,
      category: (metadata.category as any) || 'Vulnerability Research',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      summary: metadata.summary || '',
      readingTime: metadata.readingTime || '10 min read',
      featuredImage: metadata.featuredImage,
      featured: Boolean(metadata.featured),
      content,
      impact: metadata.impact,
      affectedSystems: metadata.affectedSystems,
    };
  });
}

export function loadProjectsFromMarkdown(): Project[] {
  const files = import.meta.glob<string>(
    ['/src/content/projects/**/*.{md,mdx}', '/content/projects/**/*.{md,mdx}'],
    { query: '?raw', eager: true, import: 'default' }
  );

  return Object.entries(files).map(([filepath, rawContent]) => {
    const segments = filepath.split('/');
    const filename = segments.pop()?.replace(/\.(md|mdx)$/, '') || '';
    const parentFolder = segments.pop() || '';
    const fallbackSlug = filename === 'index' ? parentFolder : filename;

    const { metadata, content } = parseFrontmatter<Partial<Project>>(rawContent);

    return {
      id: metadata.id || metadata.slug || fallbackSlug,
      title: metadata.title || fallbackSlug,
      slug: metadata.slug || fallbackSlug,
      description: metadata.description || '',
      category: (metadata.category as any) || 'Security Tools',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      language: metadata.language || 'Python',
      stars: metadata.stars || 0,
      license: metadata.license || 'MIT',
      lastUpdated: String(metadata.lastUpdated || new Date().toISOString().split('T')[0]),
      githubUrl: metadata.githubUrl || 'https://github.com/xomnibot',
      demoUrl: metadata.demoUrl,
      docsUrl: metadata.docsUrl,
      featured: Boolean(metadata.featured),
      content,
      features: Array.isArray(metadata.features) ? metadata.features : [],
      installation: Array.isArray(metadata.installation) ? metadata.installation : [],
    };
  });
}

export function loadBlogPostsFromMarkdown(): BlogPost[] {
  const files = import.meta.glob<string>(
    ['/src/content/blog/**/*.{md,mdx}', '/content/blog/**/*.{md,mdx}'],
    { query: '?raw', eager: true, import: 'default' }
  );

  return Object.entries(files).map(([filepath, rawContent]) => {
    const segments = filepath.split('/');
    const filename = segments.pop()?.replace(/\.(md|mdx)$/, '') || '';
    const parentFolder = segments.pop() || '';
    const fallbackSlug = filename === 'index' ? parentFolder : filename;

    const { metadata, content } = parseFrontmatter<Partial<BlogPost>>(rawContent);

    return {
      id: metadata.id || metadata.slug || fallbackSlug,
      title: metadata.title || fallbackSlug,
      slug: metadata.slug || fallbackSlug,
      date: String(metadata.date || new Date().toISOString().split('T')[0]),
      category: (metadata.category as any) || 'Career',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      summary: metadata.summary || '',
      readingTime: metadata.readingTime || '5 min read',
      featuredImage: metadata.featuredImage,
      featured: Boolean(metadata.featured),
      content,
    };
  });
}

export function loadCheatsheetsFromMarkdown(): Cheatsheet[] {
  const files = import.meta.glob<string>(
    ['/src/content/cheatsheets/**/*.{md,mdx}', '/content/cheatsheets/**/*.{md,mdx}'],
    { query: '?raw', eager: true, import: 'default' }
  );

  return Object.entries(files).map(([filepath, rawContent]) => {
    const segments = filepath.split('/');
    const filename = segments.pop()?.replace(/\.(md|mdx)$/, '') || '';
    const parentFolder = segments.pop() || '';
    const fallbackSlug = filename === 'index' ? parentFolder : filename;

    const { metadata, content } = parseFrontmatter<any>(rawContent);

    let sections = Array.isArray(metadata.sections) ? metadata.sections : [];

    if (sections.length === 0 && content) {
      sections = [{ title: 'Commands & Syntax', items: [{ command: 'See details below', description: content }] }];
    }

    return {
      id: metadata.id || metadata.slug || fallbackSlug,
      title: metadata.title || fallbackSlug,
      slug: metadata.slug || fallbackSlug,
      category: (metadata.category as any) || 'Linux',
      description: metadata.description || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      lastUpdated: String(metadata.lastUpdated || new Date().toISOString().split('T')[0]),
      sections,
      content,
    };
  });
}
