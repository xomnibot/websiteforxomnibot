import { NavItem, FooterSection } from '@/types/navigation';

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Writeups', path: '/writeups' },
  { label: 'Research', path: '/research', badge: 'CVE' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Cheat Sheets', path: '/cheatsheets' },
  { label: 'YouTube', path: '/youtube' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Platform Hub',
    links: [
      { label: 'Home', path: '/' },
      { label: 'Writeups', path: '/writeups' },
      { label: 'Security Research', path: '/research' },
      { label: 'Open Source Tools', path: '/projects' },
      { label: 'Cheat Sheets', path: '/cheatsheets' },
      { label: 'YouTube Content', path: '/youtube' },
    ],
  },
  {
    title: 'Research Categories',
    links: [
      { label: 'CVE Analysis', path: '/research?category=CVE+Analysis' },
      { label: 'Exploit Internals', path: '/research?category=Exploit+Internals' },
      { label: 'Malware Analysis', path: '/research?category=Malware+Analysis' },
      { label: 'Browser Security', path: '/research?category=Browser+Security' },
      { label: 'AI Security', path: '/research?category=AI+Security' },
    ],
  },
  {
    title: 'Brand & Connect',
    links: [
      { label: 'About xomnibot', path: '/about' },
      { label: 'Contact & Security', path: '/contact' },
      { label: 'GitHub Repositories', path: 'https://github.com/xomnibot', external: true },
      { label: 'YouTube Channel', path: 'https://youtube.com/@xomnibot', external: true },
      { label: 'X (Twitter)', path: 'https://x.com/xomnibot', external: true },
    ],
  },
];
