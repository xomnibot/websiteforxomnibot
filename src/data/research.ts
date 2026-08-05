import { ResearchPaper } from '@/types/content';

export const sampleResearch: ResearchPaper[] = [
  {
    id: 'r1',
    title: 'CVE-2026-21849: Netfilter Use-After-Free Root Escalation',
    slug: 'cve-2026-21849-netfilter-kernel-exploit',
    date: '2026-07-28',
    cve: 'CVE-2026-21849',
    category: 'CVE Analysis',
    tags: ['Linux Kernel', 'Netfilter', 'Use-After-Free', 'LPE'],
    summary: 'Root cause analysis of Netfilter UAF flaw, heap spray primitives, and modprobe_path overwrite for local root escalation.',
    readingTime: '10 min read',
    featured: true,
    impact: 'Local Privilege Escalation (LPE) to root on Linux Kernels 6.1 - 6.12.',
    affectedSystems: 'Linux kernels with unprivileged user namespaces enabled.',
    content: `
## Executive Summary

A Use-After-Free (UAF) flaw in \`nf_tables_api.c\` allows unprivileged local users to achieve root execution by manipulating batch netlink transactions.

## Key Exploitation Steps

1. **Heap Spraying**: Controlled kmalloc-512 allocations using \`msg_msg\` payloads.
2. **Modprobe Overwrite**: Target \`modprobe_path\` to trigger root script execution on unknown socket requests.
`,
  },
  {
    id: 'r2',
    title: 'V8 JIT Speculative Optimization Out-Of-Bounds Primitives',
    slug: 'v8-jit-speculative-optimization-exploits',
    date: '2026-06-30',
    category: 'Browser Security',
    tags: ['V8', 'Chrome', 'JIT', 'Compiler', 'Browser Security'],
    summary: 'How Turbofan optimization assumptions in Chromium V8 produce out-of-bounds array access and arbitrary memory execution.',
    readingTime: '12 min read',
    featured: true,
    impact: 'Renderer Sandbox Remote Code Execution (RCE).',
    affectedSystems: 'Chromium browsers prior to v128.0.',
    content: `
## Introduction

V8 JIT compilation eliminates bounds checks based on static type inference. Incorrect assumptions allow constructing \`addrof\` and \`fakeobj\` primitives for memory corruption.
`,
  },
  {
    id: 'r3',
    title: 'Adversarial Prompt Injection in Autonomous AI Agents',
    slug: 'adversarial-prompt-injection-agentic-security',
    date: '2026-05-18',
    category: 'AI Security',
    tags: ['AI Security', 'LLM', 'Prompt Injection', 'Agentic AI'],
    summary: 'Evaluating indirect prompt injection attacks against multi-tool AI agents and enforcing strict context separation gates.',
    readingTime: '8 min read',
    featured: true,
    impact: 'Unauthorized tool invocation and data exfiltration.',
    affectedSystems: 'Autonomous AI Agent deployments with browser or shell access.',
    content: `
## Abstract

Indirect prompt injection embeds hidden instructions inside untrusted web pages or emails, causing AI agents to execute unauthorized tools.
`,
  },
];
