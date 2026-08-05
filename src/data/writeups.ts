import { Writeup } from '@/types/content';

export const sampleWriteups: Writeup[] = [
  {
    id: 'thm-pickle-rick',
    title: 'TryHackMe: Pickle Rick Walkthrough',
    slug: 'tryhackme-pickle-rick',
    date: '2026-08-04',
    platform: 'TryHackMe',
    difficulty: 'Easy',
    category: 'Web Exploitation',
    tags: ['web', 'command-injection', 'privilege-escalation', 'sudo'],
    summary: 'A Rick and Morty themed CTF challenge requiring web reconnaissance, command injection vulnerability exploitation, and sudo privilege escalation to retrieve all three secret ingredients.',
    readingTime: '8 min read',
    featuredImage: '/writeups/tryhackme/pickle_rick/banner.png',
    featured: true,
    objectives: [
      'Perform web enumeration with Nmap and GoBuster.',
      'Exploit unauthenticated command execution in the web portal.',
      'Escalate privileges using misconfigured sudo permissions (sudo -l).',
    ],
    tools: ['Nmap', 'GoBuster', 'Burp Suite', 'Netcat'],
    content: `
### 1. Initial Reconnaissance & Scanning

We start by running an Nmap scan against the target IP address to discover open ports and running services:

\`\`\`bash
nmap -sC -sV -oN nmap/initial.nmap $TARGET_IP
\`\`\`

#### Discovered Services:
- **Port 22 (SSH)**: Open (OpenSSH 7.2p2)
- **Port 80 (HTTP)**: Open (Apache httpd 2.4.18)

Next, inspect the web application running on port 80. Viewing the page source reveals a hidden username comment:

\`\`\`html
<!-- Note to self: Username is R1ckRul3s -->
\`\`\`

---

### 2. Directory Fuzzing & Ingredient #1

Using **GoBuster** to enumerate directories and files:

\`\`\`bash
gobuster dir -u http://$TARGET_IP/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html
\`\`\`

#### Key Findings:
- \`/robots.txt\` -> Contains string: \`Wubbalubbadubdub\`
- \`/login.php\` -> Login portal interface

Using username \`R1ckRul3s\` and password \`Wubbalubbadubdub\`, we gain access to the Command Panel.

![Command Panel](/writeups/tryhackme/pickle_rick/panel.png)

Executing commands in the panel reveals **Ingredient 1**:

\`\`\`bash
cat "Sup3r_S3cur3_fl4g.txt"
\`\`\`

---

### 3. Privilege Escalation & Ingredients #2 & #3

Checking \`sudo -l\` permissions:

\`\`\`bash
sudo -l
\`\`\`

Output shows user \`www-data\` can run **all commands as root without a password**:

\`\`\`bash
(ALL : ALL) NOPASSWD: ALL
\`\`\`

We can read the remaining ingredients directly using \`sudo cat\`:

\`\`\`bash
sudo cat /home/rick/second\ ingredient
sudo cat /root/3rd.txt
\`\`\`

---

### Defensive Mitigation & Lessons Learned

1. **Disable Plaintext Secrets in HTML**: Never leave hardcoded usernames or passwords in public client-side comments or \`robots.txt\`.
2. **Restrict Web Server Sudo Rights**: Restrict \`www-data\` from executing arbitrary root commands via \`/etc/sudoers\`.
    `,
  },
];
