/**
 * Lists existing posts per collection (from GitHub, not a local cache),
 * lazily loading title/date/draft from each file's frontmatter, with
 * Edit / toggle draft / Delete / View live actions.
 */
import { useEffect, useState } from 'react';
import { Eye, EyeOff, ExternalLink, Loader2, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { COLLECTIONS, type CollectionKey } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import { COLLECTION_LABELS } from './lib/fields';
import { parseFrontmatter, dumpFrontmatter } from './lib/frontmatter';
import { GitHubClient, friendlyGithubError, type ContentsEntry } from './lib/github';
import { Badge, Button, cn } from './ui';
import type { EditTarget } from './PostEditor';

interface ManageItem {
  slug: string;
  path: string;
  format: 'md' | 'mdx';
  title?: string;
  date?: string;
  draft?: boolean;
  loaded: boolean;
  busy?: boolean;
}

export function ManageTab({
  client,
  siteUrl,
  pushToast,
  onEdit,
}: {
  client: GitHubClient;
  siteUrl: string;
  pushToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onEdit: (target: EditTarget) => void;
}) {
  const [collection, setCollection] = useState<CollectionKey>('writeups');
  const [items, setItems] = useState<ManageItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ManageItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setItems([]);
    (async () => {
      try {
        const base = await discoverEntries(client, collection);
        if (cancelled) return;
        setItems(base.map((b) => ({ ...b, loaded: false })));
        setListLoading(false);
        // lazily fill in frontmatter, one at a time so the list stays responsive
        for (const entry of base) {
          if (cancelled) return;
          try {
            const file = await client.getFile(entry.path);
            if (cancelled || !file) continue;
            const { data } = parseFrontmatter(file.contentText);
            setItems((prev) =>
              prev.map((it) =>
                it.path === entry.path
                  ? { ...it, loaded: true, title: String(data.title ?? it.slug), date: data.date ? String(data.date) : undefined, draft: Boolean(data.draft) }
                  : it,
              ),
            );
          } catch {
            if (!cancelled) setItems((prev) => prev.map((it) => (it.path === entry.path ? { ...it, loaded: true } : it)));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setListLoading(false);
          pushToast('error', friendlyGithubError(err));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, client]);

  async function handleEdit(item: ManageItem) {
    setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: true } : it)));
    try {
      const file = await client.getFile(item.path);
      if (!file) {
        pushToast('error', 'Could not load that file — it may have been moved or deleted on GitHub.');
        return;
      }
      onEdit({ collection, slug: item.slug, path: item.path, format: item.format, sha: file.sha, rawContent: file.contentText });
    } catch (err) {
      pushToast('error', friendlyGithubError(err));
    } finally {
      setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: false } : it)));
    }
  }

  async function handleToggleDraft(item: ManageItem) {
    setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: true } : it)));
    try {
      const file = await client.getFile(item.path);
      if (!file) throw new Error('File not found.');
      const { data, body } = parseFrontmatter(file.contentText);
      const nextDraft = !Boolean(data.draft);
      const nextText = `${dumpFrontmatter({ ...data, draft: nextDraft })}\n${body.replace(/^\n+/, '')}`;
      await client.commitFiles(
        [{ path: item.path, contentText: nextText }],
        `content(${collection}): ${nextDraft ? 'unpublish' : 'publish'} ${item.slug}`,
      );
      setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, draft: nextDraft, busy: false } : it)));
      pushToast('success', `${nextDraft ? 'Marked as draft' : 'Published'}: ${item.title ?? item.slug}.`);
    } catch (err) {
      pushToast('error', friendlyGithubError(err));
      setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: false } : it)));
    }
  }

  async function handleDeleteConfirmed(item: ManageItem) {
    setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: true } : it)));
    try {
      const mediaFiles = await client.listFilesRecursive(`public/media/${collection}/${item.slug}`);
      await client.commitFiles(
        [{ path: item.path, delete: true }, ...mediaFiles.map((p) => ({ path: p, delete: true }))],
        `content(${collection}): delete ${item.slug}`,
      );
      setItems((prev) => prev.filter((it) => it.path !== item.path));
      pushToast('success', `Deleted "${item.title ?? item.slug}".`);
    } catch (err) {
      pushToast('error', friendlyGithubError(err));
      setItems((prev) => prev.map((it) => (it.path === item.path ? { ...it, busy: false } : it)));
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Collection</span>
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value as CollectionKey)}
            className="h-9 rounded-lg border border-line bg-elevated px-3 text-sm text-fg"
          >
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {COLLECTION_LABELS[c].label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCollection((c) => c)}>
          <RefreshCw className="size-3.5" /> Refresh
        </Button>
      </div>

      {listLoading && (
        <div className="flex items-center gap-2 py-8 text-sm text-subtle">
          <Loader2 className="size-4 animate-spin" /> Loading posts from GitHub…
        </div>
      )}

      {!listLoading && items.length === 0 && (
        <p className="rounded-lg border border-dashed border-line-strong p-8 text-center text-sm text-subtle">
          No {COLLECTION_LABELS[collection].label.toLowerCase()} yet.
        </p>
      )}

      <div className="flex flex-col divide-y divide-line rounded-xl border border-line bg-elevated">
        {items.map((item) => (
          <div key={item.path} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-fg">{item.loaded ? item.title || item.slug : item.slug}</p>
                {item.draft && <Badge tone="amber">Draft</Badge>}
              </div>
              <p className="font-mono text-xs text-subtle">
                {item.path} {item.date && `· ${formatDate(item.date)}`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={`${siteUrl}/${collection}/${item.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-2 text-subtle hover:bg-surface hover:text-fg"
                title="View live"
              >
                <ExternalLink className="size-4" />
              </a>
              <button
                onClick={() => handleToggleDraft(item)}
                disabled={item.busy || !item.loaded}
                className="rounded-md p-2 text-subtle hover:bg-surface hover:text-fg disabled:opacity-40"
                title={item.draft ? 'Publish' : 'Mark as draft'}
              >
                {item.draft ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                onClick={() => handleEdit(item)}
                disabled={item.busy}
                className="rounded-md p-2 text-subtle hover:bg-surface hover:text-fg disabled:opacity-40"
                title="Edit"
              >
                {item.busy ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" />}
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                disabled={item.busy}
                className="rounded-md p-2 text-subtle hover:bg-red/10 hover:text-red disabled:opacity-40"
                title="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog item={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDeleteConfirmed(deleteTarget)} />
      )}
    </div>
  );
}

function DeleteConfirmDialog({ item, onCancel, onConfirm }: { item: ManageItem; onCancel: () => void; onConfirm: () => void }) {
  const [text, setText] = useState('');
  const matches = text === item.slug;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl border border-line bg-elevated p-5">
        <p className="text-sm font-semibold text-fg">Delete "{item.title ?? item.slug}"?</p>
        <p className="mt-1 text-sm text-muted">
          This removes <code className="text-fg">{item.path}</code> and its <code className="text-fg">public/media/</code>{' '}
          folder in one commit. This can't be undone from here.
        </p>
        <p className="mt-3 text-xs text-subtle">
          Type <code className="text-fg">{item.slug}</code> to confirm.
        </p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={cn(
            'mt-1 h-10 w-full rounded-lg border bg-bg px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            matches ? 'border-red/50' : 'border-line',
          )}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" disabled={!matches} onClick={onConfirm}>
            Delete permanently
          </Button>
        </div>
      </div>
    </div>
  );
}

async function discoverEntries(
  client: GitHubClient,
  collection: CollectionKey,
): Promise<{ slug: string; path: string; format: 'md' | 'mdx' }[]> {
  const entries = await client.listContents(`content/${collection}`);
  const out: { slug: string; path: string; format: 'md' | 'mdx' }[] = [];
  for (const entry of entries) {
    if (entry.type === 'file' && /\.mdx?$/.test(entry.name)) {
      out.push({
        slug: entry.name.replace(/\.mdx?$/, ''),
        path: entry.path,
        format: entry.name.endsWith('.mdx') ? 'mdx' : 'md',
      });
    } else if (entry.type === 'dir') {
      const inner: ContentsEntry[] = await client.listContents(entry.path);
      const index = inner.find((f) => f.type === 'file' && /^index\.mdx?$/.test(f.name));
      if (index) {
        out.push({ slug: entry.name, path: index.path, format: index.name.endsWith('.mdx') ? 'mdx' : 'md' });
      }
    }
  }
  return out;
}
