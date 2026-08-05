---
title: "Nmap Speed & Enumeration Cheatsheet"
slug: "nmap-cheatsheet"
category: "Nmap"
description: "Essential Nmap command flags, timing options, and NSE scripts for fast network enumeration."
tags:
  - nmap
  - recon
  - networking
lastUpdated: "2026-08-04"
sections:
  - title: "Port Scanning Basics"
    items:
      - command: "nmap -sC -sV -oN initial.nmap $TARGET_IP"
        description: "Default scripts (-sC), service version detection (-sV), output to normal file (-oN)."
      - command: "nmap -p- --min-rate 5000 $TARGET_IP"
        description: "Fast scan across all 65,535 TCP ports with minimum packet rate."
  - title: "NSE Script Scanning"
    items:
      - command: "nmap --script vuln $TARGET_IP"
        description: "Run all safe vulnerability detection scripts against open services."
---

### Additional Notes

Nmap remains the primary network scanner for penetration testing and CTF challenges.
