/**
 * The "New post / upload" workflow: pick a collection, drop/paste content +
 * images, fill the frontmatter form, preview, and publish in one atomic
 * GitHub commit. Also used for "Edit" from the Manage tab (via `editTarget`)
 * — the target path stays the same unless the format (.md <-> .mdx) changes,
 * in which case the old path is deleted and the new one created in the same
 * commit.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileWarning,
  RotateCcw,
  Rocket,
  Info,
} from 'lucide-react';
import { COLLECTIONS, type CollectionKey } from '@/lib/schemas';
import { slugify } from '@/lib/utils';
import { COLLECTION_LABELS } from './lib/fields';
import {
  defaultFormState,
  frontmatterToFormState,
  formStateToFrontmatterObject,
  validateFrontmatterData,
  validateSlug,
  type AdminFormState,
} from './lib/formData';
import { parseFrontmatter, extractH1Title, serializePost } from './lib/frontmatter';
import { buildImageManifest, rewriteImagePaths, unreferencedImages, MAX_IMAGE_BYTES } from './lib/images';
import { validateMdx } from './lib/mdx';
import { fileToBase64 } from './lib/base64';
import { GitHubClient, friendlyGithubError, type CommitFileEntry } from './lib/github';
import { saveDraft, loadDraft, clearDraft } from './lib/storage';
import type { UploadedImage, FrontmatterFieldError } from './lib/types';
import { Dropzone } from './Dropzone';
import { FrontmatterForm, type SlugStatus } from './FrontmatterForm';
import { PreviewPane } from './PreviewPane';
import { Button, StepDot, cn } from './ui';

export interface EditTarget {
  collection: CollectionKey;
  slug: string;
  path: string;
  format: 'md' | 'mdx';
  sha: string;
  rawContent: string;
}

type Tab = 'write' | 'details' | 'preview';

export function PostEditor({
  client,
  siteUrl,
  pushToast,
  editTarget,
  onPublished,
}: {
  client: GitHubClient;
  siteUrl: string;
  pushToast: (type: 'success' | 'error' | 'info', message: string) => void;
  editTarget?: EditTarget | null;
  onPublished: () => void;
}) {
  const isEdit = Boolean(editTarget);
  const [collection, setCollection] = useState<CollectionKey>(editTarget?.collection ?? 'writeups');
  const [format, setFormat] = useState<'md' | 'mdx'>(editTarget?.format ?? 'mdx');
  const [pasteMode, setPasteMode] = useState(isEdit);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bodyRaw, setBodyRaw] = useState('');
  const [form, setForm] = useState<AdminFormState>(() => defaultFormState(collection));
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [errors, setErrors] = useState<FrontmatterFieldError[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('write');
  const [missingAcknowledged, setMissingAcknowledged] = useState(false);
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const [mdxError, setMdxError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(0);
  const [publishResult, setPublishResult] = useState<{ commitUrl: string; liveUrl: string } | null>(null);

  const draftLoadedRef = useRef(false);

  // ---- initial load: edit target, or restore an autosaved draft ----------
  useEffect(() => {
    if (editTarget) {
      const { data, body, hadFrontmatter } = parseFrontmatter(editTarget.rawContent);
      let workingBody = body;
      let title = data.title as string | undefined;
      if (!hadFrontmatter || !title) {
        const extracted = extractH1Title(body);
        if (extracted.title) {
          title = extracted.title;
          workingBody = extracted.body;
        }
      }
      const fs = frontmatterToFormState(editTarget.collection, { ...data, title: title ?? data.title, slug: editTarget.slug });
      fs.slug = editTarget.slug;
      if (!fs.date) fs.date = editTarget.rawContent ? fs.date : '';
      setForm(fs);
      setBodyRaw(workingBody);
      setFileName(editTarget.path.split('/').pop() ?? null);
      draftLoadedRef.current = true;
      return;
    }
    if (!draftLoadedRef.current) {
      const draft = loadDraft();
      if (draft) {
        setCollection(draft.collection);
        setFormat(draft.format);
        setBodyRaw(draft.body);
        setForm(draft.form);
        setSlugTouched(Boolean(draft.form.slug));
        pushToast('info', 'Restored your unsaved draft from this browser.');
      }
      draftLoadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTarget]);

  // ---- autosave (form + body, not images) ---------------------------------
  useEffect(() => {
    if (!draftLoadedRef.current) return;
    const t = setTimeout(() => {
      saveDraft({ collection, format, body: bodyRaw, form, savedAt: Date.now() });
    }, 800);
    return () => clearTimeout(t);
  }, [collection, format, bodyRaw, form]);

  // ---- image manifest + rewritten body ------------------------------------
  const manifest = useMemo(() => new Map(images.map((img) => [img.originalName.toLowerCase(), img.filename])), [images]);
  const rewrite = useMemo(
    () => rewriteImagePaths(bodyRaw, { collection, slug: form.slug || 'untitled', manifest }),
    [bodyRaw, collection, form.slug, manifest],
  );
  const unreferenced = useMemo(() => unreferencedImages(manifest, rewrite.used), [manifest, rewrite.used]);

  useEffect(() => setMissingAcknowledged(false), [rewrite.missing.join('|')]);

  // ---- slug collision check -------------------------------------------------
  useEffect(() => {
    if (isEdit) {
      setSlugStatus('idle');
      return;
    }
    if (!form.slug || !validateSlug(form.slug)) {
      setSlugStatus('idle');
      return;
    }
    let cancelled = false;
    setSlugStatus('checking');
    const t = setTimeout(async () => {
      const candidates = [
        `content/${collection}/${form.slug}.md`,
        `content/${collection}/${form.slug}.mdx`,
        `content/${collection}/${form.slug}/index.md`,
        `content/${collection}/${form.slug}/index.mdx`,
      ];
      try {
        for (const path of candidates) {
          const file = await client.getFile(path);
          if (cancelled) return;
          if (file) {
            setSlugStatus('taken');
            return;
          }
        }
        if (!cancelled) setSlugStatus('available');
      } catch {
        if (!cancelled) setSlugStatus('error');
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [collection, form.slug, isEdit, client]);
  useEffect(() => setOverwriteConfirmed(false), [slugStatus]);

  // ---- handlers --------------------------------------------------------
  function handleCollectionChange(next: CollectionKey) {
    setCollection(next);
    setForm((f) => ({ ...f, extras: defaultFormState(next).extras }));
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(true);
    setForm((f) => ({ ...f, slug }));
  }

  function handleFileLoaded(name: string, text: string) {
    const detectedFormat: 'md' | 'mdx' = name.toLowerCase().endsWith('.mdx') ? 'mdx' : 'md';
    const { data, body, hadFrontmatter } = parseFrontmatter(text);
    let workingBody = body;
    let title = data.title as string | undefined;
    if (!title) {
      const extracted = extractH1Title(body);
      if (extracted.title) {
        title = extracted.title;
        workingBody = extracted.body;
      }
    }
    const fs = frontmatterToFormState(collection, { ...data, title: title ?? '' });
    if (!fs.date) fs.date = new Date().toISOString().slice(0, 10);
    setForm(fs);
    setSlugTouched(Boolean(fs.slug));
    if (!fs.slug && fs.title) setForm((f) => ({ ...f, slug: slugify(fs.title) }));
    setBodyRaw(workingBody);
    setFormat(detectedFormat);
    setFileName(name);
    setMdxError(null);
    if (!hadFrontmatter) {
      pushToast('info', 'No frontmatter found — pre-filled the title from the first heading and set today\'s date.');
    }
  }

  function handleAddImages(files: File[]) {
    const combined = [...images.map((i) => i.originalName), ...files.map((f) => f.name)];
    const nextManifest = buildImageManifest(combined);
    const additions: UploadedImage[] = files.map((file) => ({
      originalName: file.name,
      filename: nextManifest.get(file.name.toLowerCase()) ?? file.name,
      file,
      previewUrl: URL.createObjectURL(file),
      size: file.size,
    }));
    setImages((prev) => [...prev, ...additions]);
    for (const img of additions) {
      if (img.size > MAX_IMAGE_BYTES) pushToast('info', `${img.originalName} is over 5 MB — consider a smaller screenshot.`);
    }
  }

  function handleRemoveImage(filename: string) {
    setImages((prev) => {
      const target = prev.find((i) => i.filename === filename);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.filename !== filename);
    });
  }

  useEffect(
    () => () => {
      images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function handleDiscardDraft() {
    clearDraft();
    setCollection('writeups');
    setFormat('mdx');
    setBodyRaw('');
    setForm(defaultFormState('writeups'));
    setImages([]);
    setFileName(null);
    setSlugTouched(false);
    setActiveTab('write');
    pushToast('info', 'Draft discarded.');
  }

  async function handlePublish() {
    setErrors([]);
    setMdxError(null);

    if (!form.title.trim()) {
      pushToast('error', 'Give the post a title first.');
      setActiveTab('details');
      return;
    }
    if (!validateSlug(form.slug)) {
      pushToast('error', 'Fix the slug — lowercase letters, numbers, and hyphens only.');
      setActiveTab('details');
      return;
    }
    if (rewrite.missing.length > 0 && !missingAcknowledged) {
      pushToast('error', `${rewrite.missing.length} referenced image(s) are missing — acknowledge or add them first.`);
      setActiveTab('write');
      return;
    }
    if (!isEdit && slugStatus === 'taken' && !overwriteConfirmed) {
      pushToast('error', 'A post already exists at this slug — confirm overwrite first.');
      setActiveTab('details');
      return;
    }

    const frontmatterObj = formStateToFrontmatterObject(collection, form);
    const outcome = validateFrontmatterData(collection, frontmatterObj);
    if (!outcome.success) {
      setErrors(outcome.errors);
      setActiveTab('details');
      pushToast('error', `${outcome.errors.length} field${outcome.errors.length === 1 ? '' : 's'} need attention.`);
      return;
    }

    if (format === 'mdx') {
      const mdxOutcome = await validateMdx(rewrite.body, 'mdx');
      if (!mdxOutcome.ok) {
        const loc = mdxOutcome.error?.line ? ` (line ${mdxOutcome.error.line})` : '';
        setMdxError(`${mdxOutcome.error?.message}${loc}`);
        setActiveTab('preview');
        pushToast('error', "MDX didn't compile — see the Preview tab for details.");
        return;
      }
    }

    setPublishing(true);
    setPublishStep(0);
    try {
      const targetPath = isEdit ? (format === editTarget!.format ? editTarget!.path : buildPath(collection, form.slug, format)) : buildPath(collection, form.slug, format);
      const finalText = serializePost(frontmatterObj, rewrite.body);

      setPublishStep(1);
      const entries: CommitFileEntry[] = [{ path: targetPath, contentText: finalText }];
      for (const img of images) {
        entries.push({ path: `public/media/${collection}/${form.slug}/${img.filename}`, contentBase64: await fileToBase64(img.file) });
      }
      if (isEdit && editTarget!.path !== targetPath) {
        entries.push({ path: editTarget!.path, delete: true });
      }

      setPublishStep(2);
      const message = `content(${collection}): ${isEdit ? 'update' : 'add'} ${form.title.trim()}`;
      const result = await client.commitFiles(entries, message);

      setPublishStep(3);
      setPublishResult({ commitUrl: result.commitUrl, liveUrl: `${siteUrl}/${collection}/${form.slug}` });
      clearDraft();
      pushToast('success', `Published "${form.title.trim()}".`);
      onPublished();
    } catch (err) {
      pushToast('error', friendlyGithubError(err));
    } finally {
      setPublishing(false);
    }
  }

  const hasContent = bodyRaw.trim().length > 0 || Boolean(fileName);

  if (publishResult) {
    return <SuccessPanel result={publishResult} onNew={handleDiscardDraft} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Collection</span>
          <select
            value={collection}
            disabled={isEdit}
            onChange={(e) => handleCollectionChange(e.target.value as CollectionKey)}
            className="h-9 rounded-lg border border-line bg-elevated px-3 text-sm text-fg disabled:opacity-60"
          >
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {COLLECTION_LABELS[c].label}
              </option>
            ))}
          </select>
          <span className="hidden text-xs text-subtle sm:inline">{COLLECTION_LABELS[collection].description}</span>
        </div>
        {!isEdit && (
          <button type="button" onClick={handleDiscardDraft} className="flex items-center gap-1 text-xs text-subtle hover:text-red">
            <RotateCcw className="size-3.5" /> Discard draft
          </button>
        )}
      </div>

      <div className="flex gap-1 border-b border-line">
        {(['write', 'details', 'preview'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab ? 'border-accent text-fg' : 'border-transparent text-subtle hover:text-fg',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'write' && (
        <Dropzone
          hasContent={hasContent}
          fileName={fileName}
          pasteMode={pasteMode}
          onSetPasteMode={setPasteMode}
          bodyText={bodyRaw}
          onBodyTextChange={setBodyRaw}
          format={format}
          onFormatChange={setFormat}
          onFileLoaded={handleFileLoaded}
          images={images}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onWarn={(m) => pushToast('info', m)}
        />
      )}

      {activeTab === 'details' && (
        <FrontmatterForm
          collection={collection}
          form={form}
          onChange={setForm}
          onTitleChange={handleTitleChange}
          onSlugChange={handleSlugChange}
          slugEditable={!isEdit}
          slugStatus={slugStatus}
          errors={errors}
          images={images}
        />
      )}

      {activeTab === 'preview' && (
        <div className="flex flex-col gap-4">
          {rewrite.missing.length > 0 && (
            <WarningBanner icon={FileWarning} tone="amber">
              Referenced but not provided: {rewrite.missing.join(', ')}.
              <label className="mt-1 flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={missingAcknowledged} onChange={(e) => setMissingAcknowledged(e.target.checked)} />
                Publish anyway (these links will 404 until the images are added)
              </label>
            </WarningBanner>
          )}
          {unreferenced.length > 0 && (
            <WarningBanner icon={Info} tone="blue">
              Uploaded but not referenced anywhere in the body: {unreferenced.join(', ')}.
            </WarningBanner>
          )}
          {mdxError && (
            <WarningBanner icon={AlertTriangle} tone="red">
              <p className="font-medium">MDX failed to compile</p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{mdxError}</pre>
              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFormat('md')}>
                Publish as .md instead
              </Button>
            </WarningBanner>
          )}
          <PreviewPane collection={collection} slug={form.slug || 'untitled'} body={rewrite.body} format={format} images={images} form={form} />
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        {!isEdit && slugStatus === 'taken' && (
          <label className="flex items-center gap-1.5 text-xs text-amber">
            <input type="checkbox" checked={overwriteConfirmed} onChange={(e) => setOverwriteConfirmed(e.target.checked)} />
            Overwrite existing post at content/{collection}/{form.slug}
          </label>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="hidden items-center gap-4 sm:flex">
            <StepDot label="Content" done={hasContent} active={activeTab === 'write'} />
            <StepDot label="Details" done={Boolean(form.title && form.slug)} active={activeTab === 'details'} />
            <StepDot label="Preview" active={activeTab === 'preview'} />
          </div>
          <Button onClick={handlePublish} loading={publishing} disabled={!hasContent}>
            {!publishing && <Rocket className="size-4" />}
            {publishing ? publishStepLabel(publishStep) : isEdit ? 'Publish update' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function buildPath(collection: CollectionKey, slug: string, format: 'md' | 'mdx'): string {
  return `content/${collection}/${slug}.${format}`;
}

function publishStepLabel(step: number): string {
  return ['Preparing…', 'Uploading images…', 'Committing…', 'Done'][step] ?? 'Publishing…';
}

function WarningBanner({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof Info;
  tone: 'amber' | 'blue' | 'red';
  children: React.ReactNode;
}) {
  const tones = {
    amber: 'border-amber/30 bg-amber/10 text-amber',
    blue: 'border-blue/30 bg-blue/10 text-blue',
    red: 'border-red/30 bg-red/10 text-red',
  };
  return (
    <div className={cn('flex items-start gap-2 rounded-lg border p-3 text-sm', tones[tone])}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="text-fg">{children}</div>
    </div>
  );
}

function SuccessPanel({ result, onNew }: { result: { commitUrl: string; liveUrl: string }; onNew: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-green/30 bg-green/10 p-8 text-center">
      <CheckCircle2 className="size-10 text-green" />
      <div>
        <p className="text-lg font-semibold text-fg">Published</p>
        <p className="mt-1 text-sm text-muted">
          Vercel usually deploys in about a minute. The page will be live at:
        </p>
        <a href={result.liveUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-accent underline">
          {result.liveUrl} <ExternalLink className="size-3.5" />
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <a href={result.commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-fg">
          View commit <ExternalLink className="size-3.5" />
        </a>
      </div>
      <Button onClick={onNew}>Write another post</Button>
    </div>
  );
}
