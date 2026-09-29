/** Milestones shown on the About / Home timeline. Ported from the legacy site. */

export interface TimelineMilestone {
  year: string;
  title: string;
  category: 'Research' | 'Tool' | 'CTF' | 'Platform' | 'Milestone';
  description: string;
  link?: string;
}

export const timeline: TimelineMilestone[] = [
  {
    year: '2026',
    title: 'Launched xomnibot.in',
    category: 'Platform',
    description:
      'Moved all my notes, writeups and tools into one place, with a publishing flow that turns plain Markdown into posts.',
    link: '/',
  },
  {
    year: '2026',
    title: 'OmniScanner v1.0 released',
    category: 'Tool',
    description: 'First public release of my Rust binary-triage CLI, now used in my own reverse-engineering workflow.',
    link: '/projects/omniscanner',
  },
  {
    year: '2025',
    title: 'OAuth & JWT research series',
    category: 'Research',
    description:
      'Deep dives into OAuth 2.0 state and redirect flaws, plus a Burp extension for testing JWT implementations.',
    link: '/research',
  },
  {
    year: '2025',
    title: 'Built an Active Directory attack lab',
    category: 'Milestone',
    description:
      'Automated a vulnerable two-DC domain with Vagrant + Ansible and worked through Kerberoasting, ACL abuse and DCSync.',
    link: '/writeups',
  },
  {
    year: '2024',
    title: 'Home SOC lab + honeypot study',
    category: 'Milestone',
    description:
      'Set up Wazuh, Suricata and Sysmon at home and ran a 30-day SSH honeypot to see real attacker behaviour.',
  },
  {
    year: '2024',
    title: 'First university CTF team',
    category: 'CTF',
    description: 'Co-founded a small CTF team with classmates; weekly practice on web and pwn challenges.',
    link: '/writeups',
  },
  {
    year: '2023',
    title: 'Started with Linux and OverTheWire',
    category: 'Milestone',
    description: 'Daily-drove Linux, finished Bandit, and started the TryHackMe learning paths. That was it — hooked.',
  },
];
