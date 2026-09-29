/**
 * Image filename sanitizing + in-body path rewriting for the /admin app.
 * Pure functions (no DOM), safe to unit test with plain node.
 *
 * Handles: `![alt](img.png)`, `![alt](./img.png)`, `![alt](images/img.png)`
 * (any relative path, matched by basename), URL-encoded names
 * (`My%20Shot.png`), Obsidian embeds `![[img.png]]` / `![[img.png|alt]]`,
 * and `<img src="...">`. Absolute http(s) URLs and existing `/media/...`
 * paths are left untouched.
 */

export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function safeDecodeURIComponent(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

/** lowercase, spaces -> "-", strips accents/unsafe chars, keeps a lowercase extension. */
export function sanitizeFilename(name: string): string {
  const decoded = safeDecodeURIComponent(name).trim();
  const dot = decoded.lastIndexOf('.');
  const hasExt = dot > 0 && dot < decoded.length - 1;
  const base = hasExt ? decoded.slice(0, dot) : decoded;
  const ext = hasExt ? decoded.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const cleanBase =
    base
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image';
  return ext ? `${cleanBase}.${ext}` : cleanBase;
}

function basenameOf(pathOrName: string): string {
  const noQuery = pathOrName.split(/[?#]/)[0];
  const decoded = safeDecodeURIComponent(noQuery);
  const parts = decoded.split('/');
  return parts[parts.length - 1] ?? decoded;
}

/**
 * Builds a lookup from lowercased original basename -> sanitized on-disk
 * filename, resolving collisions (two images that sanitize to the same
 * name) by appending -2, -3, ...
 */
export function buildImageManifest(originalNames: string[]): Map<string, string> {
  const manifest = new Map<string, string>();
  const used = new Set<string>();
  for (const original of originalNames) {
    const key = basenameOf(original).toLowerCase();
    if (manifest.has(key)) continue;
    let sanitized = sanitizeFilename(original);
    if (used.has(sanitized)) {
      const dot = sanitized.lastIndexOf('.');
      const base = dot > 0 ? sanitized.slice(0, dot) : sanitized;
      const ext = dot > 0 ? sanitized.slice(dot) : '';
      let n = 2;
      while (used.has(`${base}-${n}${ext}`)) n++;
      sanitized = `${base}-${n}${ext}`;
    }
    used.add(sanitized);
    manifest.set(key, sanitized);
  }
  return manifest;
}

export interface RewriteResult {
  body: string;
  /** Original basenames referenced in the body but not present in the manifest. */
  missing: string[];
  /** Sanitized filenames from the manifest that ended up referenced somewhere in the body. */
  used: Set<string>;
}

function shouldSkipRewrite(rawPath: string): boolean {
  return (
    /^https?:\/\//i.test(rawPath) ||
    /^data:/i.test(rawPath) ||
    rawPath.startsWith('/media/') ||
    rawPath.startsWith('/')
  );
}

function resolveOne(
  rawPath: string,
  manifest: Map<string, string>,
  collection: string,
  slug: string,
  missing: Set<string>,
  used: Set<string>,
): string {
  const trimmed = rawPath.trim();
  if (!trimmed || shouldSkipRewrite(trimmed)) return rawPath;
  const basename = basenameOf(trimmed);
  const sanitized = manifest.get(basename.toLowerCase());
  if (!sanitized) {
    missing.add(basename);
    return rawPath;
  }
  used.add(sanitized);
  return `/media/${collection}/${slug}/${sanitized}`;
}

/** Converts Obsidian `![[img.png]]` / `![[img.png|alt text]]` to standard markdown images. */
function convertObsidianEmbeds(body: string): string {
  return body.replace(/!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_m, name: string, alt?: string) => {
    const cleanName = name.trim();
    const cleanAlt = (alt ?? cleanName.replace(/\.[a-z0-9]+$/i, '')).trim();
    return `![${cleanAlt}](${cleanName})`;
  });
}

/** Rewrites every image reference in a markdown/MDX body to `/media/<collection>/<slug>/<file>`. */
export function rewriteImagePaths(
  body: string,
  opts: { collection: string; slug: string; manifest: Map<string, string> },
): RewriteResult {
  const { collection, slug, manifest } = opts;
  const missing = new Set<string>();
  const used = new Set<string>();

  let out = convertObsidianEmbeds(body);

  // Standard markdown images: ![alt](path "optional title")
  out = out.replace(
    /!\[([^\]]*)\]\(\s*(<[^>]*>|[^)\s]+)(\s+"[^"]*")?\s*\)/g,
    (full, alt: string, rawPath: string, title = '') => {
      const angleBrackets = rawPath.startsWith('<') && rawPath.endsWith('>');
      const path = angleBrackets ? rawPath.slice(1, -1) : rawPath;
      const resolved = resolveOne(path, manifest, collection, slug, missing, used);
      if (resolved === path) return full; // unchanged (skip or missing)
      return `![${alt}](${resolved}${title})`;
    },
  );

  // HTML <img src="...">
  out = out.replace(/(<img\b[^>]*\bsrc\s*=\s*)(["'])(.*?)\2/gi, (full, prefix: string, quote: string, src: string) => {
    const resolved = resolveOne(src, manifest, collection, slug, missing, used);
    if (resolved === src) return full;
    return `${prefix}${quote}${resolved}${quote}`;
  });

  return { body: out, missing: Array.from(missing), used };
}

/** Basenames referenced by `manifest` values that never appeared in `used`. */
export function unreferencedImages(manifest: Map<string, string>, used: Set<string>): string[] {
  const out: string[] = [];
  for (const sanitized of manifest.values()) {
    if (!used.has(sanitized)) out.push(sanitized);
  }
  return out;
}

export function isImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.includes(ext);
}
