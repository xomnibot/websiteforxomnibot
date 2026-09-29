/**
 * Shown when there's no stored token: explains what a fine-grained PAT is
 * and why it's safe (browser-only, one repo, Contents-only), links straight
 * to the token-creation page, and validates the pasted token.
 */
import { useState } from 'react';
import { ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import { GitHubClient, friendlyGithubError } from './lib/github';
import { siteConfig } from '@/lib/site';
import { Button, Field, TextInput } from './ui';

const NEW_TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new';

export function ConnectScreen({ onConnected }: { onConnected: (token: string) => void }) {
  const [token, setToken] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token.trim()) return;
    setConnecting(true);
    setError(null);
    try {
      const client = new GitHubClient({
        token: token.trim(),
        owner: siteConfig.repo.owner,
        repo: siteConfig.repo.name,
        branch: siteConfig.repo.branch,
      });
      const { canPush } = await client.validateAccess();
      if (!canPush) {
        setError("This token can see the repo but doesn't have write access. Make sure Contents permission is set to Read and write.");
        setConnecting(false);
        return;
      }
      onConnected(token.trim());
    } catch (err) {
      setError(friendlyGithubError(err));
      setConnecting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-12">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">// admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg">Connect to GitHub</h1>
        <p className="mt-2 text-sm text-muted">
          Publish writeups straight from your browser — no terminal, no YAML by hand. This needs a small access token,
          created once, stored only on this device.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-elevated p-4 text-sm text-muted">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
          <p>
            The token only ever goes to <code className="rounded bg-surface px-1 py-0.5 text-fg">api.github.com</code>{' '}
            from your browser, and is saved in this browser's local storage — never sent anywhere else, never logged.
          </p>
        </div>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>
            Open{' '}
            <a href={NEW_TOKEN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent underline">
              github.com/settings/personal-access-tokens/new <ExternalLink className="size-3" />
            </a>
          </li>
          <li>
            Under <strong className="text-fg">Repository access</strong>, choose{' '}
            <strong className="text-fg">Only select repositories</strong> → <code className="text-fg">{siteConfig.repo.name}</code>.
          </li>
          <li>
            Under <strong className="text-fg">Permissions → Repository permissions</strong>, set{' '}
            <strong className="text-fg">Contents</strong> to <strong className="text-fg">Read and write</strong>. Leave
            everything else as-is.
          </li>
          <li>Set an expiration you're comfortable with, then click Generate token.</li>
          <li>Paste the token below.</li>
        </ol>
      </div>

      <form onSubmit={handleConnect} className="flex flex-col gap-3">
        <Field label="Personal access token" required>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <TextInput
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="github_pat_…"
              className="pl-9"
            />
          </div>
        </Field>
        {error && <p className="text-sm text-red">{error}</p>}
        <Button type="submit" loading={connecting} disabled={!token.trim()}>
          {connecting ? 'Connecting…' : 'Connect'}
        </Button>
      </form>
    </div>
  );
}
