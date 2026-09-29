/**
 * Root of the /admin React island. Gates on a stored GitHub token (shows
 * ConnectScreen otherwise), then offers "New post" and "Manage" tabs.
 */
import { useMemo, useState } from 'react';
import { LogOut, FilePlus2, FolderKanban } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { GitHubClient } from './lib/github';
import { getStoredToken, setStoredToken, clearStoredToken } from './lib/storage';
import { ConnectScreen } from './ConnectScreen';
import { PostEditor, type EditTarget } from './PostEditor';
import { ManageTab } from './ManageTab';
import { ToastHost, useToasts, cn } from './ui';

type MainTab = 'new' | 'manage';

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [tab, setTab] = useState<MainTab>('new');
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const { toasts, push, dismiss } = useToasts();

  const client = useMemo(() => {
    if (!token) return null;
    return new GitHubClient({ token, owner: siteConfig.repo.owner, repo: siteConfig.repo.name, branch: siteConfig.repo.branch });
  }, [token]);

  function handleConnected(t: string) {
    setStoredToken(t);
    setToken(t);
    push('success', 'Connected to GitHub.');
  }

  function handleForget() {
    clearStoredToken();
    setToken(null);
  }

  function handleEdit(target: EditTarget) {
    setEditTarget(target);
    setEditorKey((k) => k + 1);
    setTab('new');
  }

  function handleNewPost() {
    setEditTarget(null);
    setEditorKey((k) => k + 1);
    setTab('new');
  }

  if (!client) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ConnectScreen onConnected={handleConnected} />
        <ToastHost toasts={toasts} dismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">// admin</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-fg">
            Publish to {siteConfig.repo.owner}/{siteConfig.repo.name}
          </h1>
        </div>
        <button onClick={handleForget} className="flex items-center gap-1.5 text-xs text-subtle hover:text-red">
          <LogOut className="size-3.5" /> Forget token
        </button>
      </header>

      <nav className="mb-6 flex gap-1 rounded-lg border border-line bg-surface p-1">
        <TabButton active={tab === 'new'} onClick={handleNewPost} icon={FilePlus2}>
          {editTarget ? 'Editing post' : 'New post'}
        </TabButton>
        <TabButton
          active={tab === 'manage'}
          onClick={() => {
            setTab('manage');
          }}
          icon={FolderKanban}
        >
          Manage
        </TabButton>
      </nav>

      <div className={cn(tab === 'new' ? 'block' : 'hidden')}>
        <PostEditor
          key={editorKey}
          client={client}
          siteUrl={siteConfig.url}
          pushToast={push}
          editTarget={editTarget}
          onPublished={() => {
            setEditTarget(null);
          }}
        />
      </div>
      <div className={cn(tab === 'manage' ? 'block' : 'hidden')}>
        <ManageTab client={client} siteUrl={siteConfig.url} pushToast={push} onEdit={handleEdit} />
      </div>

      <ToastHost toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FilePlus2;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-elevated text-fg shadow-sm' : 'text-subtle hover:text-fg',
      )}
    >
      <Icon className="size-4" /> {children}
    </button>
  );
}
