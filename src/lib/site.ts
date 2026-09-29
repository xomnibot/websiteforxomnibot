/** Site-wide configuration: persona, socials, skills, stats, nav, repo info. */

export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'xomnibot',
  domain: 'xomnibot.in',
  url: 'https://xomnibot.in',
  tagline: 'Cybersecurity Whiz & Open Source Builder',
  description:
    'Curious security researcher and developer who loves breaking systems, solving CTF puzzles, and building open-source security tools.',
  mission:
    'To make technical cybersecurity research fun, accessible, and 100% practical through code, CTF teardowns, and open-source software.',

  persona: {
    handle: 'xomnibot',
    role: 'Security Researcher & Systems Enthusiast',
    favoriteOS: 'Arch Linux + Hyprland',
    primaryLanguages: ['Python', 'Go', 'Rust', 'Bash'],
    favoriteSecurityTools: ['Burp Suite', 'Ghidra', 'BloodHound', 'Impacket', 'NetExec'],
    funFacts: [
      'Broke my own homelab more times than any CTF box — and learned more from fixing it.',
      'Weekend ritual: one retired Hack The Box machine, one writeup.',
      'Believes knowledge is best when shared with zero gatekeeping.',
    ],
    rig: {
      os: 'Arch Linux (Hyprland) + Kali VM',
      terminal: 'Kitty + Zsh + Neovim',
      editor: 'VS Code + Neovim',
      hardware: 'ThinkPad T14 (32GB) + second-hand mini PC running Proxmox',
    },
  },

  socials: {
    github: 'https://github.com/xomnibot',
    email: 'omnibotx.contact@gmail.com',
  },

  currentFocus: {
    learning: 'Hack The Box — Active Directory track',
    currentResearch: 'OAuth 2.0 & JWT implementation flaws',
    activeTool: 'OmniScanner v1.5 — PE support',
    nextWriteup: 'PortSwigger practitioner labs: SSRF',
  },

  skills: {
    offensive: ['Web Security', 'Active Directory', 'Binary Exploitation', 'Reverse Engineering', 'API Security'],
    defensive: ['Threat Hunting', 'Malware Analysis', 'Patch Diffing', 'Log Auditing'],
    development: ['Python', 'C / C++', 'TypeScript', 'Rust', 'Docker', 'Linux'],
    aiSecurity: ['Prompt Injection', 'Agentic AI Audit', 'LLM Sandbox Security'],
  },

  /** GitHub repo the /admin page commits content to. */
  repo: {
    owner: 'xomnibot',
    name: 'websiteforxomnibot',
    branch: 'main',
  },
} as const;

export const nav: { primary: NavItem[]; secondary: NavItem[] } = {
  primary: [
    { label: 'Home', href: '/' },
    { label: 'Writeups', href: '/writeups' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ],
  secondary: [
    { label: 'Research', href: '/research' },
    { label: 'Blog', href: '/blog' },
    { label: 'Cheatsheets', href: '/cheatsheets' },
    { label: 'Contact', href: '/contact' },
    { label: 'Tags', href: '/tags' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};
