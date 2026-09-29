/**
 * Frontmatter form: common fields (title, slug, description, date, tags,
 * draft/featured, cover) + per-collection extra fields from
 * lib/fields.ts (advanced ones collapsed).
 */
import { Check, ImageOff, Loader2, TriangleAlert } from 'lucide-react';
import { COLLECTION_EXTRA_FIELDS, type FieldDescriptor } from './lib/fields';
import { validateSlug } from './lib/formData';
import type { AdminFormState } from './lib/formData';
import type { UploadedImage } from './lib/types';
import type { CollectionKey } from '@/lib/schemas';
import type { FrontmatterFieldError } from './lib/types';
import { Field, TextInput, TextArea, Select, SelectWithCustom, ChipInput, ListInput, Toggle, Collapsible, cn } from './ui';

export type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

function errorFor(errors: FrontmatterFieldError[], path: string): string | undefined {
  return errors.find((e) => e.path === path)?.message;
}

export function FrontmatterForm({
  collection,
  form,
  onChange,
  onTitleChange,
  onSlugChange,
  slugEditable,
  slugStatus,
  errors,
  images,
}: {
  collection: CollectionKey;
  form: AdminFormState;
  onChange: (updater: (f: AdminFormState) => AdminFormState) => void;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  slugEditable: boolean;
  slugStatus: SlugStatus;
  errors: FrontmatterFieldError[];
  images: UploadedImage[];
}) {
  const set = <K extends keyof AdminFormState>(key: K, value: AdminFormState[K]) =>
    onChange((f) => ({ ...f, [key]: value }));
  const setExtra = (key: string, value: string | string[]) =>
    onChange((f) => ({ ...f, extras: { ...f.extras, [key]: value } }));

  const fields = COLLECTION_EXTRA_FIELDS[collection];
  const mainFields = fields.filter((f) => !f.advanced);
  const advancedFields = fields.filter((f) => f.advanced);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Title" required error={errorFor(errors, 'title')}>
        <TextInput value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="A clear, descriptive title" />
      </Field>

      <Field
        label="Slug"
        required
        error={
          form.slug && !validateSlug(form.slug)
            ? 'Only lowercase letters, numbers, and hyphens.'
            : errorFor(errors, 'slug')
        }
        hint={slugEditable ? 'lowercase-with-hyphens' : 'locked while editing an existing post'}
      >
        <div className="relative">
          <TextInput
            value={form.slug}
            disabled={!slugEditable}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
            className="pr-8 font-mono disabled:opacity-60"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            {slugStatus === 'checking' && <Loader2 className="size-4 animate-spin text-subtle" />}
            {slugStatus === 'available' && <Check className="size-4 text-green" />}
            {slugStatus === 'taken' && <TriangleAlert className="size-4 text-amber" />}
          </span>
        </div>
        {slugStatus === 'taken' && (
          <p className="text-xs text-amber">A post already exists at this slug — publishing will require overwrite confirmation.</p>
        )}
      </Field>

      <Field label="Description" hint="optional — falls back to the first paragraph if left blank" error={errorFor(errors, 'description')}>
        <TextArea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="One or two sentences for cards, RSS, and search results."
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" required error={errorFor(errors, 'date')}>
          <TextInput type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Updated" hint="optional">
          <TextInput type="date" value={form.updated} onChange={(e) => set('updated', e.target.value)} />
        </Field>
      </div>

      <Field label="Tags" error={errorFor(errors, 'tags')}>
        <ChipInput values={form.tags} onChange={(v) => set('tags', v)} placeholder="Add a tag and press Enter…" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Toggle checked={form.draft} onChange={(v) => set('draft', v)} label="Draft" description="Hidden from production builds" />
        <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" description="Highlighted on the site" />
      </div>

      <CoverPicker
        cover={form.cover}
        coverAlt={form.coverAlt}
        images={images}
        onCoverChange={(v) => set('cover', v)}
        onCoverAltChange={(v) => set('coverAlt', v)}
        error={errorFor(errors, 'cover')}
      />

      <div className="h-px bg-line" />
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        // {collection} fields
      </p>

      {mainFields.map((fd) => (
        <ExtraField key={fd.key} descriptor={fd} value={form.extras[fd.key]} onChange={(v) => setExtra(fd.key, v)} error={errorFor(errors, fd.key)} />
      ))}

      {advancedFields.length > 0 && (
        <Collapsible title="Advanced fields">
          {advancedFields.map((fd) => (
            <ExtraField key={fd.key} descriptor={fd} value={form.extras[fd.key]} onChange={(v) => setExtra(fd.key, v)} error={errorFor(errors, fd.key)} />
          ))}
        </Collapsible>
      )}

      {collection === 'cheatsheets' && form.sectionsRaw !== undefined && (
        <p className="rounded-lg border border-line bg-surface p-3 font-mono text-xs text-subtle">
          This file has a <code className="text-fg">sections</code> block (advanced cheatsheet content) — it's preserved
          as-is and isn't editable here.
        </p>
      )}
    </div>
  );
}

function ExtraField({
  descriptor,
  value,
  onChange,
  error,
}: {
  descriptor: FieldDescriptor;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  error?: string;
}) {
  const strValue = typeof value === 'string' ? value : '';
  const arrValue = Array.isArray(value) ? value : [];

  return (
    <Field label={descriptor.label} error={error} hint={descriptor.help}>
      {descriptor.type === 'text' && (
        <TextInput value={strValue} placeholder={descriptor.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {descriptor.type === 'url' && (
        <TextInput type="url" value={strValue} placeholder={descriptor.placeholder ?? 'https://…'} onChange={(e) => onChange(e.target.value)} />
      )}
      {descriptor.type === 'number' && (
        <TextInput type="number" value={strValue} placeholder={descriptor.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {descriptor.type === 'textarea' && (
        <TextArea value={strValue} placeholder={descriptor.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {descriptor.type === 'select' &&
        (descriptor.allowCustom ? (
          <SelectWithCustom value={strValue} onChange={onChange} options={descriptor.options ?? []} />
        ) : (
          <Select value={strValue} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {(descriptor.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        ))}
      {descriptor.type === 'chips' && <ChipInput values={arrValue} onChange={onChange} placeholder={descriptor.placeholder} />}
      {descriptor.type === 'list' && <ListInput values={arrValue} onChange={onChange} placeholder={descriptor.placeholder} />}
    </Field>
  );
}

function CoverPicker({
  cover,
  coverAlt,
  images,
  onCoverChange,
  onCoverAltChange,
  error,
}: {
  cover: string;
  coverAlt: string;
  images: UploadedImage[];
  onCoverChange: (v: string) => void;
  onCoverAltChange: (v: string) => void;
  error?: string;
}) {
  const isCustomUrl = cover !== '' && !images.some((img) => img.filename === cover);
  return (
    <Field label="Cover image" hint="optional" error={error}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCoverChange('')}
          className={cn(
            'flex aspect-video w-24 flex-col items-center justify-center gap-1 rounded-lg border text-[10px] text-subtle',
            cover === '' ? 'border-accent bg-accent/10 text-accent' : 'border-line-strong hover:border-accent/40',
          )}
        >
          <ImageOff className="size-4" /> None
        </button>
        {images.map((img) => (
          <button
            key={img.filename}
            type="button"
            onClick={() => onCoverChange(img.filename)}
            className={cn(
              'relative aspect-video w-24 overflow-hidden rounded-lg border-2',
              cover === img.filename ? 'border-accent' : 'border-transparent hover:border-line-strong',
            )}
            title={img.filename}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.previewUrl} alt={img.originalName} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <TextInput
        value={isCustomUrl ? cover : ''}
        onChange={(e) => onCoverChange(e.target.value)}
        placeholder="…or paste an absolute image URL"
        className="mt-2"
      />
      {cover && (
        <TextInput
          value={coverAlt}
          onChange={(e) => onCoverAltChange(e.target.value)}
          placeholder="Cover alt text (accessibility)"
          className="mt-2"
        />
      )}
    </Field>
  );
}
