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
      'Fueled by cold brew and dark mode UIs.',
    ],
    rig: {
      os: 'Arch Linux (Hyprland) + Kali VM',
      terminal: 'Kitty + Zsh + Neovim',
      editor: 'VS Code + Neovim',
      hardware: 'ThinkPad T14 (32GB) + second-hand mini PC running Proxmox',
    },
  },

  stats: [
    { label: 'CTF Machines Solved', value: '50+' },
    { label: 'CVE Research Papers', value: '10+' },
    { label: 'Open Source Tools', value: '5+' },
    { label: 'GitHub Stars', value: '2.5k+' },
  ],

  socials: {
    github: 'https://github.com/xomnibot',
    youtube: 'https://youtube.com/@xomnibot',
    linkedin: 'https://linkedin.com/in/xomnibot',
    x: 'https://x.com/xomnibot',
    email: 'contact@xomnibot.in',
  },

  currentFocus: {
    activeTarget: 'V8 JIT Engine Optimization Bypasses',
    currentResearch: 'CVE-2026 OAuth & JWT Logic Flaws',
    activeTool: 'OmniScanner v1.5 - Binary Vulnerability Triage',
    nextVideo: 'Exploiting Linux Kernel Drivers for Fun',
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
    { label: 'Research', href: '/research' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Cheatsheets', href: '/cheatsheets' },
    { label: 'About', href: '/about' },
  ],
  secondary: [
    { label: 'YouTube', href: '/youtube' },
    { label: 'Contact', href: '/contact' },
    { label: 'Tags', href: '/tags' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};
