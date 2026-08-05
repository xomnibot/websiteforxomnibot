import { BlogPost } from '@/types/content';

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Building a Web Vulnerability Research Methodology',
    slug: 'systematic-methodology-web-vulnerability-research',
    date: '2026-07-14',
    category: 'Study Methods',
    tags: ['Learning', 'Methodology', 'Web Security'],
    summary: 'Organizing security notes, building mind maps, and systematically enumerating web attack surfaces.',
    readingTime: '5 min read',
    featured: true,
    content: `
## Core Pillars

1. **Structured Notes**: Organize by protocol and target function.
2. **Automated Recon**: Wrap discovery output into searchable JSON.
3. **Deep Code Inspection**: Spend 70% of time reading source and API docs.
`,
  },
  {
    id: 'b2',
    title: 'DEF CON 33: Offensive AI & Modern Kernel Security',
    slug: 'defcon-33-takeaways-offensive-ai-kernel',
    date: '2026-08-02',
    category: 'Conferences',
    tags: ['DEF CON', 'AI Security', 'Kernel'],
    summary: 'Key takeaways from DEF CON 33 covering Linux kernel mitigation bypasses and offensive AI agent workflows.',
    readingTime: '6 min read',
    featured: true,
    content: `
## Highlights

- **AI Village**: Autonomous lateral movement workflow demonstrations.
- **Kernel Exploitation**: eBPF security boundary and Kernel CFI bypasses.
`,
  },
];
