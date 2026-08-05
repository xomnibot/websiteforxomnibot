import { Writeup } from '@/types/content';

export const sampleWriteups: Writeup[] = [
  {
    id: '1',
    title: 'PortSwigger OAuth 2.0 Account Takeover',
    slug: 'portswigger-oauth-account-takeover',
    date: '2026-08-01',
    platform: 'PortSwigger',
    difficulty: 'Hard',
    category: 'Web Security',
    tags: ['OAuth 2.0', 'JWT', 'Account Takeover'],
    summary: 'Exploiting unvalidated redirect URIs and implicit grant token leaks to achieve pre-auth account takeover.',
    readingTime: '8 min read',
    featured: true,
    objectives: [
      'Bypass redirect URI regex filters using path traversal.',
      'Exfiltrate implicit grant fragment tokens.',
      'Implement strict URL whitelist policies.',
    ],
    prerequisites: ['OAuth 2.0 Implicit Grant Flow', 'Burp Suite Repeater'],
    tools: ['Burp Suite Pro', 'OAuth Flaw Finder', 'Python Exploit Server'],
    content: `
## Overview

OAuth 2.0 implementations frequently fail at enforcing strict redirect URI validation. When an identity provider (IdP) relies on regex matching for \`redirect_uri\`, access tokens can be leaked to external origins.

### Key Exploitation Steps

1. **Path Traversal Probing**:
   Submitting \`redirect_uri=https://client.xomnibot.in/callback/../open-redirect\` allowed bypassing domain whitelists.

2. **Token Harvesting**:
   URL fragments (\`#access_token=...\`) were preserved across HTTP 302 redirects to our attacker server log.

### Mitigation Guidance

- Enforce exact string matching for registered \`redirect_uri\` endpoints.
- Enforce PKCE (Proof Key for Code Exchange) across all clients.
`,
  },
  {
    id: '2',
    title: 'Active Directory Attack Chain: AS-REP Roasting to DCSync',
    slug: 'tryhackme-ad-enterprise-chain',
    date: '2026-07-20',
    platform: 'Active Directory',
    difficulty: 'Hard',
    category: 'Active Directory',
    tags: ['Kerberos', 'AS-REP Roasting', 'BloodHound', 'DCSync'],
    summary: 'Full attack path from unauthenticated AS-REP roasting to BloodHound ACL traversal and DCSync domain compromise.',
    readingTime: '10 min read',
    featured: true,
    objectives: [
      'Request TGT hashes via GetNPUsers.py.',
      'Crack hashes using Hashcat mode 18200.',
      'Execute DCSync via secretsdump.py.',
    ],
    prerequisites: ['Kerberos Authentication Protocols', 'Impacket Framework'],
    tools: ['Impacket', 'BloodHound', 'Hashcat', 'Evil-WinRM'],
    content: `
## Overview

Active Directory misconfigurations allow rapid lateral movement. This walkthrough covers kerberos roasting and ACL exploitation.

### Key Exploitation Steps

1. **AS-REP Roasting**:
   \`\`\`bash
   GetNPUsers.py CORP.LOCAL/ -no-pass -usersfile users.txt -dc-ip 10.10.120.5
   \`\`\`

2. **Privilege Escalation via BloodHound**:
   Compromised account possessed GenericAll rights over \`svc_sql\`, which held DCSync permissions.

3. **DCSync Domain Takeover**:
   \`\`\`bash
   secretsdump.py CORP.LOCAL/svc_sql:'Pass123!'@10.10.120.5 -just-dc-ntlm
   \`\`\`
`,
  },
  {
    id: '3',
    title: 'Reverse Engineering a Custom Rust Loader',
    slug: 'htb-malware-rust-loader-rev',
    date: '2026-07-05',
    platform: 'Hack The Box',
    difficulty: 'Insane',
    category: 'Reverse Engineering',
    tags: ['Reverse Engineering', 'Rust', 'IDA Pro', 'Anti-Analysis'],
    summary: 'Bypassing PEB anti-debugging checks, extracting AES payload keys, and inspecting unhooked direct NTDLL syscalls.',
    readingTime: '12 min read',
    featured: true,
    objectives: [
      'Patch PEB BeingDebugged checks in x64dbg.',
      'Extract runtime AES-256 decryption keys.',
      'Dump unhooked syscall shellcode regions.',
    ],
    prerequisites: ['x86_64 Assembly', 'Dynamic Debugging'],
    tools: ['IDA Pro', 'x64dbg', 'PE-bear', 'Process Hacker'],
    content: `
## Overview

Compiled Rust binaries produce heavy code output and stripped symbols.

### Key Exploitation Steps

1. **Anti-Debugging Bypass**:
   Patched EAX register during PEB \`BeingDebugged\` check execution in x64dbg.

2. **Runtime Memory Dumping**:
   Dumped decrypted memory region at runtime using Process Hacker to extract beacon payload.
`,
  },
];
