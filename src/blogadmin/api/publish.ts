export const prerender = false;
import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { MEDIA_DIR, ROOT, guard, json, postPath, validSlug } from '../lib';

const SECRET_PATTERNS: [string, RegExp][] = [
  ['GitHub fine-grained token', /github_pat_[A-Za-z0-9_]{20,}/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{20,}/],
  ['AWS access key', /\b(AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['Private key', /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{10,}/],
  ['Generic secret assignment', /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][A-Za-z0-9_\-\/+=]{24,}["']/i],
];

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/** Values from .env files (>=8 chars) must never appear in the diff. */
function envSecrets(): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(ROOT)) {
    if (f !== '.env' && !(f.startsWith('.env.') && f !== '.env.example')) continue;
    for (const line of fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n')) {
      const v = line.replace(/^[^=]*=/, '').trim().replace(/^["']|["']$/g, '');
      if (line.includes('=') && v.length >= 8) out.push(v);
    }
  }
  return out;
}

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress);
  if (denied) return denied;
  const dryRun = url.searchParams.get('dryRun') === '1';
  const { slug, title } = await request.json().catch(() => ({}));
  const file = validSlug(slug) ? postPath(slug) : null;
  if (!file) return json({ ok: false, log: 'Save the post first (file not found).' }, 400);

  const log: string[] = [];
  const rel = (p: string) => path.relative(ROOT, p);
  const paths = [rel(file)];
  const mediaDir = path.join(MEDIA_DIR, slug);
  if (fs.existsSync(mediaDir)) paths.push(rel(mediaDir));

  try {
    // Stage exactly this post and its media folder. Never `add -A`.
    if (dryRun) {
      log.push('DRY RUN: would stage: ' + paths.join(', '));
      log.push(git(['status', '--short', '--', ...paths]) || '(no changes)');
      return json({ ok: true, dryRun: true, log: log.join('\n') });
    }
    git(['add', '--', ...paths]);
    const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
    if (!staged.length) return json({ ok: false, log: 'Nothing to publish: no changes staged.' }, 200);
    // Refuse if anything else is already staged; we only commit this post.
    const allowed = staged.every((f) => paths.some((p) => f === p || f.startsWith(p + '/')));
    if (!allowed) {
      git(['reset', '-q', '--', ...paths]);
      return json({ ok: false, log: 'Other files are already staged; refusing to include them:\n' + staged.join('\n') }, 200);
    }
    log.push('Staged:\n' + staged.join('\n'));

    // Secret scan on the staged diff.
    const diff = git(['diff', '--cached', '-U0']);
    const hits: string[] = [];
    for (const [label, re] of SECRET_PATTERNS) if (re.test(diff)) hits.push(label);
    for (const v of envSecrets()) if (diff.includes(v)) hits.push('a value from a .env file');
    if (hits.length) {
      git(['reset', '-q', '--', ...paths]);
      return json({ ok: false, log: 'REFUSED: possible secret in staged diff (' + [...new Set(hits)].join(', ') + '). Nothing committed; changes unstaged.' }, 200);
    }

    const msg = `Blog: ${String(title || slug).replace(/[\r\n]+/g, ' ').slice(0, 120)}`;
    log.push(git(['commit', '-m', msg, '--', ...paths]).trim());
    log.push(git(['push', 'origin', 'main']).trim() || 'Pushed to origin main.');
    return json({ ok: true, log: log.join('\n\n') });
  } catch (e: any) {
    log.push(String(e.stderr || e.stdout || e.message || e));
    return json({ ok: false, log: log.join('\n\n') }, 200);
  }
};
