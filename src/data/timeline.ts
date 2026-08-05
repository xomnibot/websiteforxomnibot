import { TimelineMilestone } from '@/types/content';

export const sampleTimeline: TimelineMilestone[] = [
  {
    year: '2026',
    title: 'xomnibot.in Research Hub Launch',
    category: 'Platform',
    description: 'Launched the central xomnibot cybersecurity platform, unifying technical research, CTF writeups, security tooling, and educational resources.',
    link: '/about',
  },
  {
    year: '2026',
    title: 'Released OmniScanner v1.0',
    category: 'Tool',
    description: 'Published open-source AI static binary vulnerability analyzer for reverse engineers.',
    link: '/projects/omniscanner',
  },
  {
    year: '2025',
    title: 'Published CVE-2026 Kernel Research',
    category: 'Research',
    description: 'Discovered and reported Linux Kernel Netfilter Use-After-Free flaw with full root privilege escalation PoC.',
    link: '/research/cve-2026-21849-netfilter-kernel-exploit',
  },
  {
    year: '2025',
    title: 'First YouTube Technical Series',
    category: 'Milestone',
    description: 'Launched educational video series focusing on Web Security, Active Directory, and Reverse Engineering.',
    link: '/youtube',
  },
  {
    year: '2024',
    title: 'CTF Competition Milestones',
    category: 'CTF',
    description: 'Ranked in Top 1% on TryHackMe & PortSwigger Web Security Academy Leaderboards.',
    link: '/writeups',
  },
];
