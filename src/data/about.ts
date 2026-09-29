/**
 * Content for the /about page: bio, featured projects, capabilities and
 * learning path. Edit freely — the page layout reads everything from here.
 */

export const bio = [
  "I'm a 21-year-old computer science student who got hooked on security the first time I popped a shell on an OverTheWire level. Since then I've spent most of my evenings in CTFs, homelabs and Burp Suite, trying to understand how things break — and how to stop them breaking.",
  'I like the full loop: find the bug, understand the root cause, write the exploit, then build the detection or the fix. Everything I learn ends up here as a writeup, a cheatsheet or a small open-source tool, so the next person can learn it faster than I did.',
];

export interface FeaturedProject {
  name: string;
  summary: string;
  highlights: string[];
  stack: string[];
  status: 'Active' | 'Stable' | 'Archived';
  link?: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    name: 'OmniScanner',
    summary: 'Async Rust CLI that triages ELF binaries for risky patterns before I open them in Ghidra.',
    highlights: [
      'Flags missing hardening (NX, PIE, RELRO, canaries) and dangerous libc imports',
      'Scores functions by reachability of unsafe calls to prioritise manual review',
      'JSON + SARIF output so results drop straight into CI',
    ],
    stack: ['Rust', 'tokio', 'goblin', 'SARIF'],
    status: 'Active',
    link: '/projects/omniscanner',
  },
  {
    name: 'Home SOC Lab',
    summary: 'A small blue-team lab on a second-hand mini PC running Proxmox, used to practise detection engineering.',
    highlights: [
      'Wazuh SIEM + Suricata IDS + Sysmon on Windows endpoints',
      '25+ custom detection rules mapped to MITRE ATT&CK, tested with Atomic Red Team',
      'Attack → alert → write-up workflow for every technique I learn',
    ],
    stack: ['Proxmox', 'Wazuh', 'Suricata', 'Sysmon', 'Sigma'],
    status: 'Active',
  },
  {
    name: 'ADLab-in-a-Box',
    summary: 'Vagrant + Ansible scripts that spin up an intentionally vulnerable Active Directory domain in about 20 minutes.',
    highlights: [
      'Two-DC forest with seeded misconfigurations: Kerberoastable SPNs, AS-REP roastable users, weak ACLs',
      'Reset-to-snapshot so each practice run starts clean',
      'Companion attack-path notes using BloodHound, Impacket and NetExec',
    ],
    stack: ['Vagrant', 'Ansible', 'PowerShell', 'Windows Server'],
    status: 'Stable',
  },
  {
    name: 'subsweep',
    summary: 'Fast recon helper that chains passive subdomain sources, resolves them, and probes for live web services.',
    highlights: [
      'Pulls from certificate transparency logs and public DNS datasets',
      'Concurrent resolution with wildcard-DNS filtering',
      'Screenshots + tech fingerprinting for quick triage of large scopes',
    ],
    stack: ['Go', 'goroutines', 'crt.sh', 'Chromium headless'],
    status: 'Stable',
  },
  {
    name: 'JWT Inspector (Burp extension)',
    summary: 'Burp Suite extension that highlights JWTs in traffic and tests common implementation flaws in one click.',
    highlights: [
      'Checks alg=none, HS/RS key confusion, weak HMAC secrets and missing expiry',
      'Built on the Montoya API with a small custom UI tab',
      'Born out of the OAuth / JWT research on this site',
    ],
    stack: ['Java', 'Burp Montoya API', 'JWT'],
    status: 'Active',
  },
  {
    name: 'Cowrie Honeypot Study',
    summary: 'Ran an SSH honeypot on a $5 VPS for 30 days and analysed what real attackers try first.',
    highlights: [
      'Logged thousands of login attempts and dozens of dropped payloads',
      'Clustered credential lists and bot behaviour with pandas',
      'Dashboards in Grafana; findings written up on the blog',
    ],
    stack: ['Cowrie', 'Python', 'pandas', 'Grafana'],
    status: 'Archived',
  },
];

export interface Capability {
  area: string;
  points: string[];
}

/** Concrete things I can do — each backed by a lab, writeup or project. */
export const capabilities: Capability[] = [
  {
    area: 'Web application testing',
    points: [
      'Find and exploit IDOR, SSRF, SQLi, XSS, and auth/session flaws end to end',
      'Audit OAuth 2.0 and JWT flows for redirect, state and key-confusion bugs',
      'Write clear reports with impact, reproduction steps and fixes',
    ],
  },
  {
    area: 'Active Directory',
    points: [
      'Enumerate domains with BloodHound and map attack paths',
      'Kerberoasting, AS-REP roasting, ACL abuse, DCSync',
      'Explain the detection for each technique, not just the exploit',
    ],
  },
  {
    area: 'Linux & privilege escalation',
    points: [
      'Enumerate and abuse sudo, SUID, capabilities, cron and PATH issues',
      'Comfortable living in the terminal: Bash, systemd, networking, logs',
      'Harden what I break: least privilege, auditd, fail2ban',
    ],
  },
  {
    area: 'Reverse engineering & binaries',
    points: [
      'Read x86-64 disassembly in Ghidra and debug with GDB + pwndbg',
      'Stack-based buffer overflows, ret2libc and basic ROP chains',
      'Static triage of unknown binaries (see OmniScanner)',
    ],
  },
  {
    area: 'Detection & blue team',
    points: [
      'Write Sigma and Wazuh rules from attack telemetry',
      'Hunt through Sysmon, Windows Event and web server logs',
      'Map findings to MITRE ATT&CK',
    ],
  },
  {
    area: 'Tooling & automation',
    points: [
      'Build CLI tools in Python, Go and Rust',
      'Automate labs with Docker, Vagrant and Ansible',
      'Ship with Git, CI and readable docs',
    ],
  },
];

export interface LearningItem {
  name: string;
  status: 'Completed' | 'In progress' | 'Next';
  note: string;
}

export const learningPath: LearningItem[] = [
  { name: 'TryHackMe — Jr Penetration Tester path', status: 'Completed', note: 'Web, network and privesc fundamentals' },
  { name: 'PortSwigger Web Security Academy', status: 'In progress', note: 'Working through the practitioner labs topic by topic' },
  { name: 'Hack The Box — Active Directory machines', status: 'In progress', note: 'Retired AD boxes, written up as I go' },
  { name: 'OSCP preparation', status: 'Next', note: 'Structured prep once the AD track is done' },
];
