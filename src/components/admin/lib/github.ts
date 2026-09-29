/**
 * Minimal GitHub REST + Git Data API client used by /admin. Talks directly
 * to api.github.com from the browser with a fine-grained PAT. The `fetchImpl`
 * is injectable so the commit/delete/list flows can be unit tested against a
 * mocked fetch without ever calling the real API.
 */
import { textToBase64, base64ToText } from './base64';

export type GitHubErrorKind =
  | 'auth'
  | 'access'
  | 'not_found'
  | 'rate_limit'
  | 'conflict'
  | 'network'
  | 'unknown';

export class GitHubApiError extends Error {
  kind: GitHubErrorKind;
  status?: number;
  constructor(message: string, kind: GitHubErrorKind, status?: number) {
    super(message);
    this.name = 'GitHubApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Human-friendly explanation for a GitHubApiError, for toasts/inline errors. */
export function friendlyGithubError(err: unknown): string {
  if (err instanceof GitHubApiError) {
    switch (err.kind) {
      case 'auth':
        return 'That token looks invalid or has expired. Generate a new fine-grained token and reconnect.';
      case 'access':
        return "This token can't access the repository. Make sure repository access includes websiteforxomnibot and the Contents permission is set to Read and write.";
      case 'not_found':
        return "Repository not found for this token. Double-check the repo name, or that the token's repository access includes it.";
      case 'rate_limit':
        return "GitHub API rate limit reached. Wait a few minutes and try again.";
      case 'conflict':
        return 'The branch changed on GitHub while publishing (someone/something else pushed). Try again.';
      case 'network':
        return "Couldn't reach GitHub. Check your internet connection and try again.";
      default:
        return err.message || 'GitHub request failed.';
    }
  }
  return err instanceof Error ? err.message : String(err);
}

function classify(status: number, bodyText: string): GitHubErrorKind {
  if (status === 401) return 'auth';
  if (status === 403) {
    if (/rate limit/i.test(bodyText)) return 'rate_limit';
    return 'access';
  }
  if (status === 404) return 'not_found';
  if (status === 422 || status === 409) return 'conflict';
  return 'unknown';
}

export interface ContentsEntry {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
}

export interface CommitFileEntry {
  /** Repo-relative path, e.g. content/writeups/foo.mdx or public/media/writeups/foo/bar.png */
  path: string;
  /** UTF-8 text content. Mutually exclusive with contentBase64 and delete. */
  contentText?: string;
  /** Already-base64-encoded binary content. Mutually exclusive with contentText and delete. */
  contentBase64?: string;
  /** True to remove this path from the tree. */
  delete?: boolean;
}

export interface PublishResult {
  commitSha: string;
  commitUrl: string;
}

export interface GitHubClientOptions {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  fetchImpl?: typeof fetch;
}

const API_ROOT = 'https://api.github.com';

export class GitHubClient {
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  private token: string;
  private fetchImpl: typeof fetch;

  constructor(opts: GitHubClientOptions) {
    this.owner = opts.owner;
    this.repo = opts.repo;
    this.branch = opts.branch;
    this.token = opts.token;
    // Bind to globalThis: calling an unbound `fetch` as `this.fetchImpl(...)` throws "Illegal invocation" in browsers.
    this.fetchImpl = opts.fetchImpl ?? fetch.bind(globalThis);
  }

  private headers(extra?: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...extra,
    };
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    let res: Response;
    try {
      res = await this.fetchImpl(`${API_ROOT}${path}`, {
        ...init,
        headers: { ...this.headers(), ...(init?.headers as Record<string, string> | undefined) },
      });
    } catch {
      throw new GitHubApiError('Network error contacting GitHub.', 'network');
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let message = `GitHub API error (${res.status})`;
      try {
        const json = JSON.parse(text);
        if (json?.message) message = json.message;
      } catch {
        // non-JSON body, keep default message
      }
      throw new GitHubApiError(message, classify(res.status, text), res.status);
    }
    return res;
  }

  /** Validates the token can see the repo, and reports whether it has push access. */
  async validateAccess(): Promise<{ canPush: boolean; defaultBranch: string }> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}`);
    const json = await res.json();
    return {
      canPush: json?.permissions?.push !== false, // fine-grained PATs often omit `permissions`; assume true unless explicitly false
      defaultBranch: json?.default_branch ?? this.branch,
    };
  }

  /** Fetches a single file's text content + sha, or null if it doesn't exist. */
  async getFile(path: string): Promise<{ sha: string; contentText: string } | null> {
    let res: Response;
    try {
      res = await this.request(`/repos/${this.owner}/${this.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(this.branch)}`);
    } catch (err) {
      if (err instanceof GitHubApiError && err.kind === 'not_found') return null;
      throw err;
    }
    const json = await res.json();
    if (Array.isArray(json) || json.type !== 'file') return null;
    return { sha: json.sha, contentText: base64ToText(json.content ?? '') };
  }

  /** Lists a directory's immediate entries, or [] if it doesn't exist. */
  async listContents(path: string): Promise<ContentsEntry[]> {
    let res: Response;
    try {
      res = await this.request(`/repos/${this.owner}/${this.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(this.branch)}`);
    } catch (err) {
      if (err instanceof GitHubApiError && err.kind === 'not_found') return [];
      throw err;
    }
    const json = await res.json();
    if (!Array.isArray(json)) return [];
    return json.map((e: { name: string; path: string; sha: string; type: string }) => ({
      name: e.name,
      path: e.path,
      sha: e.sha,
      type: e.type as ContentsEntry['type'],
    }));
  }

  /** Recursively lists every file (not dir) under `path`. Used to delete a media folder. */
  async listFilesRecursive(path: string): Promise<string[]> {
    const entries = await this.listContents(path);
    const files: string[] = [];
    for (const entry of entries) {
      if (entry.type === 'dir') {
        files.push(...(await this.listFilesRecursive(entry.path)));
      } else if (entry.type === 'file') {
        files.push(entry.path);
      }
    }
    return files;
  }

  private async getRefSha(): Promise<string> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}/git/ref/${encodeURIComponent(`heads/${this.branch}`)}`);
    const json = await res.json();
    return json.object.sha as string;
  }

  private async getCommitTreeSha(commitSha: string): Promise<string> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}/git/commits/${commitSha}`);
    const json = await res.json();
    return json.tree.sha as string;
  }

  private async createBlob(base64Content: string): Promise<string> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}/git/blobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: base64Content, encoding: 'base64' }),
    });
    const json = await res.json();
    return json.sha as string;
  }

  private async createTree(
    baseTree: string,
    entries: { path: string; mode: '100644'; type: 'blob'; sha: string | null }[],
  ): Promise<string> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}/git/trees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base_tree: baseTree, tree: entries }),
    });
    const json = await res.json();
    return json.sha as string;
  }

  private async createCommit(message: string, tree: string, parents: string[]): Promise<string> {
    const res = await this.request(`/repos/${this.owner}/${this.repo}/git/commits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tree, parents }),
    });
    const json = await res.json();
    return json.sha as string;
  }

  private async updateRef(sha: string): Promise<void> {
    await this.request(`/repos/${this.owner}/${this.repo}/git/refs/${encodeURIComponent(`heads/${this.branch}`)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha, force: false }),
    });
  }

  /**
   * Commits a set of file writes/deletes in ONE atomic commit via the Git
   * Data API: ref -> base commit -> base tree -> blobs -> tree -> commit ->
   * update ref. On a 422 (non-fast-forward) conflict, refetches the ref and
   * retries exactly once.
   */
  async commitFiles(files: CommitFileEntry[], message: string): Promise<PublishResult> {
    return this.commitFilesAttempt(files, message, false);
  }

  private async commitFilesAttempt(files: CommitFileEntry[], message: string, isRetry: boolean): Promise<PublishResult> {
    const refSha = await this.getRefSha();
    const baseTreeSha = await this.getCommitTreeSha(refSha);

    const treeEntries: { path: string; mode: '100644'; type: 'blob'; sha: string | null }[] = [];
    for (const file of files) {
      if (file.delete) {
        treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: null });
        continue;
      }
      const base64Content = file.contentBase64 ?? textToBase64(file.contentText ?? '');
      const blobSha = await this.createBlob(base64Content);
      treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blobSha });
    }

    const newTreeSha = await this.createTree(baseTreeSha, treeEntries);
    const newCommitSha = await this.createCommit(message, newTreeSha, [refSha]);

    try {
      await this.updateRef(newCommitSha);
    } catch (err) {
      if (err instanceof GitHubApiError && err.kind === 'conflict' && !isRetry) {
        return this.commitFilesAttempt(files, message, true);
      }
      throw err;
    }

    return {
      commitSha: newCommitSha,
      commitUrl: `https://github.com/${this.owner}/${this.repo}/commit/${newCommitSha}`,
    };
  }
}

function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}
