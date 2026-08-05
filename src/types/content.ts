export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';

export type Platform = 'TryHackMe' | 'Hack The Box' | 'PortSwigger' | 'picoCTF' | 'VulnHub' | 'Active Directory' | 'Custom Lab';

export interface Writeup {
  id: string;
  title: string;
  slug: string;
  date: string;
  platform: Platform;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  summary: string;
  readingTime: string;
  featuredImage?: string;
  featured?: boolean;
  content: string;
  objectives?: string[];
  prerequisites?: string[];
  tools?: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  slug: string;
  date: string;
  cve?: string;
  category: 'CVE Analysis' | 'Vulnerability Research' | 'Exploit Internals' | 'Patch Diffing' | 'Malware Analysis' | 'Browser Security' | 'AI Security';
  tags: string[];
  summary: string;
  readingTime: string;
  featuredImage?: string;
  featured?: boolean;
  content: string;
  impact?: string;
  affectedSystems?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'AI Tools' | 'Security Tools' | 'CLI Tools' | 'Browser Extensions' | 'Automation' | 'Research Projects';
  tags: string[];
  language: string;
  stars?: number;
  license: string;
  lastUpdated: string;
  githubUrl: string;
  demoUrl?: string;
  docsUrl?: string;
  featured?: boolean;
  content: string;
  features: string[];
  installation: string[];
  roadmap?: { status: 'completed' | 'in-progress' | 'planned'; title: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Career' | 'Study Methods' | 'Productivity' | 'Tool Reviews' | 'Opinions' | 'Conferences' | 'Event Recaps';
  tags: string[];
  summary: string;
  readingTime: string;
  featuredImage?: string;
  featured?: boolean;
  content: string;
}

export interface CheatsheetItem {
  command: string;
  description: string;
  example?: string;
  tags?: string[];
}

export interface CheatsheetCategory {
  title: string;
  items: CheatsheetItem[];
}

export interface Cheatsheet {
  id: string;
  title: string;
  slug: string;
  category: 'Linux' | 'Bash' | 'PowerShell' | 'Python' | 'Nmap' | 'Burp Suite' | 'SQLMap' | 'Metasploit' | 'Active Directory' | 'Docker' | 'Git';
  description: string;
  tags: string[];
  lastUpdated: string;
  sections: CheatsheetCategory[];
  content?: string;
}

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  category: 'Research' | 'Tool' | 'CTF' | 'Platform' | 'Milestone';
  description: string;
  link?: string;
}
