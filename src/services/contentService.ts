import { sampleWriteups } from '@/data/writeups';
import { sampleResearch } from '@/data/research';
import { sampleProjects } from '@/data/projects';
import { sampleBlogPosts } from '@/data/blog';
import { sampleCheatsheets } from '@/data/cheatsheets';
import { sampleYouTubeVideos } from '@/data/youtube';
import { Writeup, ResearchPaper, Project, BlogPost, Cheatsheet, YouTubeVideo } from '@/types/content';

export const contentService = {
  // Writeups
  getWriteups: (category?: string, platform?: string, difficulty?: string, tag?: string): Writeup[] => {
    return sampleWriteups.filter((w) => {
      if (category && w.category.toLowerCase() !== category.toLowerCase()) return false;
      if (platform && w.platform.toLowerCase() !== platform.toLowerCase()) return false;
      if (difficulty && w.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
      if (tag && !w.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getWriteupBySlug: (slug: string): Writeup | undefined => {
    return sampleWriteups.find((w) => w.slug === slug);
  },

  getFeaturedWriteups: (): Writeup[] => {
    return sampleWriteups.filter((w) => w.featured);
  },

  // Research
  getResearchPapers: (category?: string, tag?: string): ResearchPaper[] => {
    return sampleResearch.filter((r) => {
      if (category && r.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !r.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getResearchBySlug: (slug: string): ResearchPaper | undefined => {
    return sampleResearch.find((r) => r.slug === slug);
  },

  getFeaturedResearch: (): ResearchPaper[] => {
    return sampleResearch.filter((r) => r.featured);
  },

  // Projects
  getProjects: (category?: string, tag?: string): Project[] => {
    return sampleProjects.filter((p) => {
      if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getProjectBySlug: (slug: string): Project | undefined => {
    return sampleProjects.find((p) => p.slug === slug);
  },

  getFeaturedProjects: (): Project[] => {
    return sampleProjects.filter((p) => p.featured);
  },

  // Blog
  getBlogPosts: (category?: string, tag?: string): BlogPost[] => {
    return sampleBlogPosts.filter((b) => {
      if (category && b.category.toLowerCase() !== category.toLowerCase()) return false;
      if (tag && !b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  },

  getBlogPostBySlug: (slug: string): BlogPost | undefined => {
    return sampleBlogPosts.find((b) => b.slug === slug);
  },

  getFeaturedBlogPosts: (): BlogPost[] => {
    return sampleBlogPosts.filter((b) => b.featured);
  },

  // Cheatsheets
  getCheatsheets: (category?: string): Cheatsheet[] => {
    return sampleCheatsheets.filter((c) => {
      if (category && c.category.toLowerCase() !== category.toLowerCase()) return false;
      return true;
    });
  },

  getCheatsheetBySlug: (slug: string): Cheatsheet | undefined => {
    return sampleCheatsheets.find((c) => c.slug === slug);
  },

  // YouTube
  getYouTubeVideos: (): YouTubeVideo[] => {
    return sampleYouTubeVideos;
  },

  // Global Unified Search Engine
  searchAll: (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { writeups: [], research: [], projects: [], blog: [], cheatsheets: [] };

    const writeups = sampleWriteups.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );

    const research = sampleResearch.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.cve && r.cve.toLowerCase().includes(q)) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );

    const projects = sampleProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const blog = sampleBlogPosts.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );

    const cheatsheets = sampleCheatsheets.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.sections.some((s) => s.items.some((i) => i.command.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)))
    );

    return { writeups, research, projects, blog, cheatsheets };
  },
};
