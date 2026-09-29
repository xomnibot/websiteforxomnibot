# xomnibot.in

Personal cybersecurity research site — CTF writeups, CVE/vulnerability research, open-source
projects, blog, cheatsheets, YouTube, about, contact. Built with [Astro](https://astro.build),
Tailwind CSS v4, and MDX. Fully static, deployed on Vercel.

This README is written for someone new to Astro. It covers running the site locally, the project
layout, and — most importantly — **how to publish a new post**.

## Running locally

Requires Node 22+ (Node 24 recommended) and npm.

```bash
npm install       # only needed once, or after pulling changes that touch package.json
npm run dev        # starts a dev server at http://localhost:4321, live-reloads
npm run build       # type-checks (astro check) then builds the static site into dist/
npm run preview     # serves the built dist/ locally, to sanity-check a production build
npm run check       # just the type-checker, no build
```

Drafts (`draft: true` in frontmatter) show up in `npm run dev` but are excluded from
`npm run build`, so you can preview unfinished posts locally without publishing them.

## Project structure

```
content/                 # your posts live here — this is the folder you actually touch
  writeups/  research/  projects/  blog/  cheatsheets/
    some-post-slug.mdx      # one file per post, filename = URL slug
public/
  media/<collection>/<slug>/<file>   # images for a post go here, referenced as /media/...
  og-default.png, favicon.svg, robots.txt
src/
  content.config.ts      # wires content/ up to Astro's content collections
  lib/schemas.ts         # frontmatter validation (zod) — what fields each collection accepts
  lib/collections.ts     # helpers to query/sort/relate posts (used by page templates)
  lib/site.ts             # site name, bio, socials, nav — edit this to change your bio/links
  layouts/BaseLayout.astro
  components/ui/          # buttons, cards, badges, etc.
  components/layout/       # header, footer, theme toggle
  components/mdx/          # <Callout>, <Figure>, <YouTube>, <Kbd>, <Steps> — usable in any .mdx
  pages/                   # routes (writeups/, research/, etc. — one folder per collection)
scripts/new.mjs           # powers `npm run new`
```

## Writing a post — 3 ways to publish

All three end up doing the same thing: adding/editing a `.mdx` (or `.md`) file under `content/`.
Vercel automatically rebuilds and redeploys the site whenever `main` on GitHub changes.

### 1. Add a file and push

Create `content/<collection>/<slug>.mdx` by hand (or copy an existing post as a starting point),
fill in the frontmatter (see the reference tables below), write the body in Markdown, commit, and
push to `main`.

### 2. `npm run new`

Scaffolds the frontmatter for you:

```bash
npm run new -- writeups "TryHackMe: My New Box"
```

This creates `content/writeups/tryhackme-my-new-box.mdx` with a full frontmatter template
(today's date, `draft: true`) and an empty `public/media/writeups/tryhackme-my-new-box/` folder
for images. Fill in the body, flip `draft: false` when it's ready, commit, push.

### 3. The `/admin` page

`/admin` (not linked in navigation, excluded from search engines) is a small in-browser editor
that commits directly to this GitHub repo via the GitHub REST API — no local git needed, works
from any browser. It needs a **fine-grained GitHub personal access token** scoped to:

- Repository access: **only this repo** (`xomnibot/websiteforxomnibot`)
- Permissions: **Contents — Read and write**

The token is stored only in your browser's `localStorage` (never sent anywhere except GitHub's
API, never committed to the repo). Create one at
[github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens/new).

## Frontmatter reference

`description`, `updated`, and `cover` are optional almost everywhere — if you skip `description`,
the site automatically shows the first paragraph of your post instead. `date` and `title` are
always required.

### All collections

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `description` | string | no | Falls back to the post's first paragraph if omitted. |
| `date` | date (`YYYY-MM-DD`) | **yes** | |
| `updated` | date | no | |
| `tags` | string[] | no | Powers `/tags` and the "related posts" section. |
| `draft` | boolean | no | Default `false`. `true` hides it from production builds. |
| `featured` | boolean | no | Default `false`. Highlights it on listing pages / home. |
| `cover` | string | no | `/media/<collection>/<slug>/banner.png`, or a full URL. |
| `coverAlt` | string | no | Alt text for `cover`. |
| `slug` | string | no | Overrides the filename-derived URL slug. |

### `writeups`

| Field | Type | Notes |
|---|---|---|
| `platform` | string | e.g. `TryHackMe`, `Hack The Box`, `PortSwigger`, `picoCTF`, `VulnHub`, `Active Directory`. Default `"Custom Lab"`. |
| `difficulty` | `Easy` \| `Medium` \| `Hard` \| `Insane` | |
| `category` | string | Default `"General"`. |
| `tools` | string[] | |
| `objectives` | string[] | |
| `prerequisites` | string[] | |

### `research`

| Field | Type | Notes |
|---|---|---|
| `category` | string | Default `"Vulnerability Research"`. |
| `cve` | string | e.g. `CVE-2026-1337`. |
| `severity` | `Low` \| `Medium` \| `High` \| `Critical` | |
| `cvss` | number | |
| `impact` | string | |
| `affectedSystems` | string | |

### `projects`

| Field | Type | Notes |
|---|---|---|
| `category` | string | Default `"Security Tools"`. |
| `repo` | url | GitHub repo link. |
| `demo` | url | |
| `docs` | url | |
| `language` | string | |
| `license` | string | |
| `stars` | number | |
| `status` | `active` \| `wip` \| `archived` | Default `active`. |
| `features` | string[] | |
| `install` | string[] | Install/run steps, one per line. |

### `blog`

| Field | Type | Notes |
|---|---|---|
| `category` | string | Default `"General"`. |

### `cheatsheets`

| Field | Type | Notes |
|---|---|---|
| `category` | string | Default `"General"`. |
| `sections` | `{ title, items: { command, description, example? }[] }[]` | The structured command table. |

## MDX components

Available in every `.mdx` file automatically — no `import` needed. (Plain `.md` files don't get
these, but still render fully styled Markdown, including tables, task lists, and footnotes.)

```mdx
<Callout type="warning" title="Careful">
  This step requires root — double-check you're on the lab VM, not your host.
</Callout>

<Figure src="/media/writeups/my-post/panel.png" alt="Command panel" caption="The exposed admin panel." />

<YouTube id="dQw4w9WgXcQ" title="Full walkthrough" />

Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to stop the listener.

<Steps>

1. First do this.
2. Then this.

</Steps>
```

`Callout` types: `note`, `tip`, `warning`, `danger`, `info`. **Important:** leave a blank line
before and after `<Steps>...</Steps>` (and around any component wrapping a Markdown list) — MDX
needs that blank line to parse the numbered list inside, otherwise it's treated as plain text.

## Images

Put post images under `public/media/<collection>/<slug>/`, then reference them with an absolute
path: `/media/writeups/my-post/banner.png`. Standard Markdown images
(`![alt](/media/.../file.png)`) are automatically styled (rounded corners, border, responsive) —
you don't need `<Figure>` unless you also want a caption.

## Deploying (Vercel)

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables are required for the site itself. The `/admin` page's GitHub token
  lives only in the browser — it is never an environment variable and never committed.
- `vercel.json` sets clean URLs and an `X-Robots-Tag: noindex` header on `/admin`.
