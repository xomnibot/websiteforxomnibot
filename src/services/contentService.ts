import { sampleWriteups } from '@/data/writeups';
import { sampleResearch } from '@/data/research';
import { sampleProjects } from '@/data/projects';
import { sampleBlogPosts } from '@/data/blog';
import { sampleCheatsheets } from '@/data/cheatsheets';
import { sampleYouTubeVideos } from '@/data/youtube';
import { Writeup, ResearchPaper, Project, BlogPost, Cheatsheet, YouTubeVideo } from '@/types/content';
import {
  loadWriteupsFromMarkdown,
  loadResearchFromMarkdown,
  loadProjectsFromMarkdown,
  loadBlogPostsFromMarkdown,
  loadCheatsheetsFromMarkdown,
} from '@/lib/markdownLoader';

// Helper to combine static TS data and dynamic Markdown folder data while deduplicating by slug
function combineContent<T extends { slug: string }>(staticItems: T[], markdownItems: T[]): T[] {
  const map = new Map<string, T>();
  // Dynamic markdown items take precedence
  staticItems.forEach((item) => map.set(item.slug, item));
  markdownItems.forEach((item) => map.set(item.slug, item));
  return Array.from(map.values());
}

export const contentService = {
  // Writeups
  getWriteups: (category?: string, platform?: string, difficulty?: string, tag?: string): Writeup[] => {
    const all = combineContent(sampleWriteups, loadWriteupsFromMarkdown());
    return all.filter((w) => {
      if (category && w.category.toLowerCase() !== category.toLowerCase()) return false;
      if (platform && w.platform.toLowerCase() !== platform.toLowerCase()) return false;
      if (difficulty && w.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
      if (tag && !w.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getWriteupBySlug: (slug: string): Writeup | undefined => {
    const all = combineContent(sampleWriteups, loadWriteupsFromMarkdown());
    return all.find((w) => w.slug === slug);
  },

  getFeaturedWriteups: (): Writeup[] => {
    const all = combineContent(sampleWriteups, loadWriteupsFromMarkdown());
    return all.filter((w) => w.featured);
  },

  // Research
  getResearchPapers: (category?: string, tag?: string): ResearchPaper[] => {
    const all = combineContent(sampleResearch, loadResearchFromMarkdown());
    return all.filter((r) => {
      if (category && r.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !r.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getResearchBySlug: (slug: string): ResearchPaper | undefined => {
    const all = combineContent(sampleResearch, loadResearchFromMarkdown());
    return all.find((r) => r.slug === slug);
  },

  getFeaturedResearch: (): ResearchPaper[] => {
    const all = combineContent(sampleResearch, loadResearchFromMarkdown());
    return all.filter((r) => r.featured);
  },

  // Projects
  getProjects: (category?: string, tag?: string): Project[] => {
    const all = combineContent(sampleProjects, loadProjectsFromMarkdown());
    return all.filter((p) => {
      if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getProjectBySlug: (slug: string): Project | undefined => {
    const all = combineContent(sampleProjects, loadProjectsFromMarkdown());
    return all.find((p) => p.slug === slug);
  },

  getFeaturedProjects: (): Project[] => {
    const all = combineContent(sampleProjects, loadProjectsFromMarkdown());
    return all.filter((p) => p.featured);
  },

  // Blog
  getBlogPosts: (category?: string, tag?: string): BlogPost[] => {
    const all = combineContent(sampleBlogPosts, loadBlogPostsFromMarkdown());
    return all.filter((b) => {
      if (category && b.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getBlogPostBySlug: (slug: string): BlogPost | undefined => {
    const all = combineContent(sampleBlogPosts, loadBlogPostsFromMarkdown());
    return all.find((b) => b.slug === slug);
  },

  getFeaturedBlogPosts: (): BlogPost[] => {
    const all = combineContent(sampleBlogPosts, loadBlogPostsFromMarkdown());
    return all.filter((b) => b.featured);
  },

  // Cheatsheets
  getCheatsheets: (category?: string): Cheatsheet[] => {
    const all = combineContent(sampleCheatsheets, loadCheatsheetsFromMarkdown());
    return all.filter((c) => {
      if (category && c.category.toLowerCase() !== category.toLowerCase()) return false;
      return true;
    });
  },

  getCheatsheetBySlug: (slug: string): Cheatsheet | undefined => {
    const all = combineContent(sampleCheatsheets, loadCheatsheetsFromMarkdown());
    return all.find((c) => c.slug === slug);
  },

  // YouTube
  getYouTubeVideos: (): YouTubeVideo[] => {
    return sampleYouTubeVideos;
  },

  // Global Unified Search Engine
  searchAll: (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { writeups: [], research: [], projects: [], blog: [], cheatsheets: [] };

    const writeups = combineContent(sampleWriteups, loadWriteupsFromMarkdown()).filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );

    const research = combineContent(sampleResearch, loadResearchFromMarkdown()).filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.cve && r.cve.toLowerCase().includes(q)) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );

    const projects = combineContent(sampleProjects, loadProjectsFromMarkdown()).filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const blog = combineContent(sampleBlogPosts, loadBlogPostsFromMarkdown()).filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );

    const cheatsheets = combineContent(sampleCheatsheets, loadCheatsheetsFromMarkdown()).filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.sections.some((s) => s.items.some((i) => i.command.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)))
    );

    return { writeups, research, projects, blog, cheatsheets };
  },
};
