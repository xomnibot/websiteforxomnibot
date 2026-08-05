---
title: "OmniScanner v1.5"
slug: "omniscanner"
description: "High-performance asynchronous binary vulnerability triage tool written in Rust."
category: "Security Tools"
tags:
  - rust
  - binary-analysis
  - vulnerability-scanner
language: "Rust"
stars: 1420
license: "MIT"
lastUpdated: "2026-08-04"
githubUrl: "https://github.com/xomnibot/omniscanner"
featured: true
features:
  - "Multi-threaded ELF & PE binary parsing"
  - "Automated ROP gadget discovery & stack canary detection"
  - "Zero external C dependencies with native Rust crates"
installation:
  - "cargo install omniscanner"
  - "omniscanner --target ./vulnerable_binary"
---

### Overview

OmniScanner is an open-source binary analysis CLI designed for CTF players and vulnerability researchers. It rapidly audits compiled ELF and PE executables to detect missing security mitigations (ASLR, DEP/NX, Stack Canaries, RELRO).

```bash
omniscanner --target /bin/ls --json output.json
```
