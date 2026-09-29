/** Per-collection field configuration for the admin frontmatter form. */
import type { CollectionKey } from '@/lib/schemas';

export const COLLECTION_LABELS: Record<CollectionKey, { label: string; singular: string; description: string }> = {
  writeups: {
    label: 'Writeups',
    singular: 'writeup',
    description: 'CTF / lab walkthroughs — TryHackMe, HTB, PortSwigger, custom labs, etc.',
  },
  research: {
    label: 'Research',
    singular: 'research post',
    description: 'CVE breakdowns, vulnerability research, disclosures.',
  },
  projects: {
    label: 'Projects',
    singular: 'project',
    description: 'Open-source tools and software you built.',
  },
  blog: {
    label: 'Blog',
    singular: 'blog post',
    description: 'General writing — roadmaps, opinions, notes.',
  },
  cheatsheets: {
    label: 'Cheatsheets',
    singular: 'cheatsheet',
    description: 'Command references and quick lookups.',
  },
};

export const PLATFORM_OPTIONS = [
  'TryHackMe',
  'Hack The Box',
  'PortSwigger',
  'picoCTF',
  'VulnHub',
  'Active Directory',
  'Custom Lab',
];

export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard', 'Insane'] as const;
export const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'] as const;
export const PROJECT_STATUS_OPTIONS = ['active', 'wip', 'archived'] as const;

export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'chips' | 'list' | 'url';

export interface FieldDescriptor {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  allowCustom?: boolean;
  placeholder?: string;
  help?: string;
  advanced?: boolean;
}

/** Extra (collection-specific) fields shown below the common fields. */
export const COLLECTION_EXTRA_FIELDS: Record<CollectionKey, FieldDescriptor[]> = {
  writeups: [
    { key: 'platform', label: 'Platform', type: 'select', options: PLATFORM_OPTIONS, allowCustom: true },
    { key: 'difficulty', label: 'Difficulty', type: 'select', options: DIFFICULTY_OPTIONS },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Web Exploitation, Active Directory, …' },
    { key: 'tools', label: 'Tools', type: 'chips', placeholder: 'Nmap, Burp Suite, …' },
    { key: 'objectives', label: 'Objectives', type: 'list', advanced: true },
    { key: 'prerequisites', label: 'Prerequisites', type: 'list', advanced: true },
  ],
  research: [
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Vulnerability Research' },
    { key: 'cve', label: 'CVE ID', type: 'text', placeholder: 'CVE-2026-1337' },
    { key: 'severity', label: 'Severity', type: 'select', options: SEVERITY_OPTIONS },
    { key: 'cvss', label: 'CVSS score', type: 'number', placeholder: '0.0 – 10.0' },
    { key: 'impact', label: 'Impact', type: 'textarea', advanced: true },
    { key: 'affectedSystems', label: 'Affected systems', type: 'text', advanced: true },
  ],
  projects: [
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Security Tools' },
    { key: 'repo', label: 'Repository URL', type: 'url', placeholder: 'https://github.com/…' },
    { key: 'demo', label: 'Demo URL', type: 'url', advanced: true },
    { key: 'docs', label: 'Docs URL', type: 'url', advanced: true },
    { key: 'language', label: 'Language', type: 'text', placeholder: 'Python, Rust, …' },
    { key: 'license', label: 'License', type: 'text', placeholder: 'MIT' },
    { key: 'stars', label: 'GitHub stars', type: 'number', advanced: true },
    { key: 'status', label: 'Status', type: 'select', options: PROJECT_STATUS_OPTIONS },
    { key: 'features', label: 'Features', type: 'list', advanced: true },
    { key: 'install', label: 'Install steps', type: 'list', advanced: true },
  ],
  blog: [{ key: 'category', label: 'Category', type: 'text', placeholder: 'General' }],
  cheatsheets: [{ key: 'category', label: 'Category', type: 'text', placeholder: 'General' }],
};
