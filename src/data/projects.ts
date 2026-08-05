import { Project } from '@/types/content';

export const sampleProjects: Project[] = [
  {
    id: 'p1',
    title: 'OmniScanner',
    slug: 'omniscanner',
    description: 'AI static binary vulnerability triage & disassembly analyzer for ELF and PE executables.',
    category: 'AI Tools',
    tags: ['Python', 'Assembly', 'Capstone', 'AI Security'],
    language: 'Python',
    stars: 1240,
    license: 'MIT',
    lastUpdated: '2026-08-02',
    githubUrl: 'https://github.com/xomnibot/omniscanner',
    docsUrl: 'https://github.com/xomnibot/omniscanner#readme',
    featured: true,
    features: [
      'Automated disassembly parsing with Capstone engine.',
      'Unsafe C function pattern detection.',
      'Offline LLM pseudo-code vulnerability explanation.',
      'SARIF JSON report export.',
    ],
    installation: [
      'git clone https://github.com/xomnibot/omniscanner.git',
      'cd omniscanner && pip install -r requirements.txt',
      'python omniscanner.py --target /path/to/binary',
    ],
    roadmap: [
      { status: 'completed', title: 'x86_64 ELF & PE Support' },
      { status: 'completed', title: 'SARIF JSON Export' },
      { status: 'in-progress', title: 'ARM64 Architecture Support' },
    ],
    content: `
OmniScanner combines classical disassembly parsing with rule engines for rapid vulnerability identification in compiled binaries.
`,
  },
  {
    id: 'p2',
    title: 'KerberoastKit',
    slug: 'kerberoastkit',
    description: 'High-performance Active Directory Kerberos ticket extractor and Hashcat coordinator in Rust.',
    category: 'Security Tools',
    tags: ['Rust', 'Active Directory', 'Kerberos', 'CLI'],
    language: 'Rust',
    stars: 890,
    license: 'GPL-3.0',
    lastUpdated: '2026-07-15',
    githubUrl: 'https://github.com/xomnibot/kerberoastkit',
    featured: true,
    features: [
      'Native ASN.1 Kerberos packet parsing.',
      'Multithreaded ticket requests across forest domains.',
      'Hashcat mode 13100 & 18200 auto-formatting.',
    ],
    installation: [
      'cargo install kerberoastkit',
      'kerberoastkit --domain corp.local --dc-ip 10.10.10.1 -u user -p pass',
    ],
    roadmap: [
      { status: 'completed', title: 'AS-REP & TGS Roasting' },
      { status: 'in-progress', title: 'AES-256 Support' },
    ],
    content: `
KerberoastKit streamlines Active Directory roasting with zero external Windows API dependencies.
`,
  },
  {
    id: 'p3',
    title: 'OAuth Auditor Extension',
    slug: 'burpsuite-oauth-auditor',
    description: 'Burp Suite Extension for automated detection of OAuth 2.0 & OIDC token leakage flaws.',
    category: 'Security Tools',
    tags: ['Java', 'Burp Suite', 'OAuth', 'JWT'],
    language: 'Java',
    stars: 640,
    license: 'Apache-2.0',
    lastUpdated: '2026-06-22',
    githubUrl: 'https://github.com/xomnibot/burpsuite-oauth-auditor',
    featured: true,
    features: [
      'Passive scanning for OAuth authorization codes.',
      'Active redirect_uri fuzzing.',
      'State parameter entropy audit.',
    ],
    installation: [
      'Download JAR from GitHub releases.',
      'Add extension in Burp Suite -> Extensions menu.',
    ],
    roadmap: [
      { status: 'completed', title: 'Passive Analyzer' },
      { status: 'in-progress', title: 'Montoya API V2 Migration' },
    ],
    content: `
OAuth Auditor extends Burp Suite with specialized rules for modern OAuth 2.0 bugs.
`,
  },
];
