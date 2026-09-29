#!/usr/bin/env node
/**
 * Scaffold a new content entry.
 *
 *   npm run new -- writeups "My Title"
 *
 * Creates content/<collection>/<slug>.mdx with a full frontmatter template
 * (today's date, draft: true) and public/media/<collection>/<slug>/ for
 * images. Refuses to overwrite an existing file.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const COLLECTIONS = ['writeups', 'research', 'projects', 'blog', 'cheatsheets'];

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function todayISO() {
  // Local calendar date, not UTC — avoids an off-by-one for timezones ahead
  // of UTC late at night (new Date().toISOString() would use UTC).
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const templates = {
  writeups: (title, date) => `---
title: "${title}"
description: ""
date: ${date}
draft: true
featured: false
platform: "Custom Lab"
difficulty: "Easy"
category: "General"
tags: []
tools: []
objectives: []
prerequisites: []
cover: ""
coverAlt: ""
---

## Overview

`,
  research: (title, date) => `---
title: "${title}"
description: ""
date: ${date}
draft: true
featured: false
category: "Vulnerability Research"
cve: ""
severity: "Medium"
cvss: 0
impact: ""
affectedSystems: ""
tags: []
cover: ""
coverAlt: ""
---

### Executive Summary

`,
  projects: (title, date) => `---
title: "${title}"
description: ""
date: ${date}
draft: true
featured: false
category: "Security Tools"
repo: ""
demo: ""
docs: ""
language: ""
license: "MIT"
stars: 0
status: "active"
features: []
install: []
tags: []
cover: ""
coverAlt: ""
---

### Overview

`,
  blog: (title, date) => `---
title: "${title}"
description: ""
date: ${date}
draft: true
featured: false
category: "General"
tags: []
cover: ""
coverAlt: ""
---

`,
  cheatsheets: (title, date) => `---
title: "${title}"
description: ""
date: ${date}
draft: true
featured: false
category: "General"
tags: []
sections:
  - title: "Section title"
    items:
      - command: ""
        description: ""
        example: ""
---

`,
};

function main() {
  const args = process.argv.slice(2);
  const [collection, title] = args;

  if (!collection || !title) {
    console.error('Usage: npm run new -- <collection> "Title"');
    console.error(`Collections: ${COLLECTIONS.join(', ')}`);
    process.exit(1);
  }

  if (!COLLECTIONS.includes(collection)) {
    console.error(`Unknown collection "${collection}". Must be one of: ${COLLECTIONS.join(', ')}`);
    process.exit(1);
  }

  const slug = slugify(title);
  if (!slug) {
    console.error('Could not derive a slug from that title.');
    process.exit(1);
  }

  const contentDir = path.join(ROOT, 'content', collection);
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const mediaDir = path.join(ROOT, 'public', 'media', collection, slug);

  if (existsSync(filePath)) {
    console.error(`Refusing to overwrite: content/${collection}/${slug}.mdx already exists.`);
    process.exit(1);
  }

  mkdirSync(contentDir, { recursive: true });
  mkdirSync(mediaDir, { recursive: true });

  const date = todayISO();
  const body = templates[collection](title, date);
  writeFileSync(filePath, body, 'utf8');

  console.log(`Created content/${collection}/${slug}.mdx`);
  console.log(
    `Created public/media/${collection}/${slug}/ — drop images there, reference as /media/${collection}/${slug}/<file>`,
  );
  console.log('draft: true by default — set to false in the frontmatter when ready to publish.');
}

main();
