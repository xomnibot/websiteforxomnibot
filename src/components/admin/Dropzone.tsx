/**
 * Content intake: drag-and-drop (or click to browse) ONE .md/.mdx file plus
 * any number of images, a "write/paste instead" textarea editor, and the
 * uploaded-image thumbnail grid with size warnings.
 */
import { useCallback, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, PenLine, Upload, X, AlertTriangle } from 'lucide-react';
import { IMAGE_EXTENSIONS, MAX_IMAGE_BYTES, isImageFile } from './lib/images';
import type { UploadedImage } from './lib/types';
import { Button, cn } from './ui';

const MD_EXTENSIONS = ['.md', '.mdx'];

function isMarkdownFile(name: string): boolean {
  const lower = name.toLowerCase();
  return MD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function Dropzone({
  hasContent,
  fileName,
  pasteMode,
  onSetPasteMode,
  bodyText,
  onBodyTextChange,
  format,
  onFormatChange,
  onFileLoaded,
  images,
  onAddImages,
  onRemoveImage,
  onWarn,
}: {
  hasContent: boolean;
  fileName: string | null;
  pasteMode: boolean;
  onSetPasteMode: (v: boolean) => void;
  bodyText: string;
  onBodyTextChange: (v: string) => void;
  format: 'md' | 'mdx';
  onFormatChange: (f: 'md' | 'mdx') => void;
  onFileLoaded: (filename: string, text: string) => void;
  images: UploadedImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (filename: string) => void;
  onWarn: (message: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const mdFiles = files.filter((f) => isMarkdownFile(f.name));
      const imageFiles = files.filter((f) => isImageFile(f.name));

      if (mdFiles.length > 1) {
        onWarn(`Only one .md/.mdx file is used at a time — using "${mdFiles[0].name}", ignored the rest.`);
      }
      if (mdFiles[0]) {
        const file = mdFiles[0];
        file.text().then((text) => onFileLoaded(file.name, text));
      }
      if (imageFiles.length) onAddImages(imageFiles);

      const rejected = files.filter((f) => !isMarkdownFile(f.name) && !isImageFile(f.name));
      if (rejected.length) {
        onWarn(`Skipped ${rejected.length} file(s) with unsupported type: ${rejected.map((f) => f.name).join(', ')}`);
      }
    },
    [onFileLoaded, onAddImages, onWarn],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={pasteMode ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onSetPasteMode(false)}
        >
          <Upload className="size-3.5" /> Drop a file
        </Button>
        <Button type="button" variant={pasteMode ? 'primary' : 'secondary'} size="sm" onClick={() => onSetPasteMode(true)}>
          <PenLine className="size-3.5" /> Write / paste instead
        </Button>
      </div>

      {!pasteMode && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors',
            dragOver ? 'border-accent bg-accent/5' : 'border-line-strong hover:border-accent/50',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={`.md,.mdx,${IMAGE_EXTENSIONS.map((e) => `.${e}`).join(',')}`}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          {hasContent ? (
            <>
              <FileText className="size-8 text-accent" />
              <p className="text-sm font-medium text-fg">{fileName ?? 'Content loaded'}</p>
              <p className="text-xs text-subtle">Click or drop again to replace, or drop more images to add them.</p>
            </>
          ) : (
            <>
              <Upload className="size-8 text-subtle" />
              <p className="text-sm font-medium text-fg">Drop your .md / .mdx file and screenshots here</p>
              <p className="text-xs text-subtle">or click to browse — images are matched to references automatically</p>
            </>
          )}
        </div>
      )}

      {pasteMode && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted">Format:</span>
            <label className="flex items-center gap-1.5 text-xs text-fg">
              <input type="radio" checked={format === 'md'} onChange={() => onFormatChange('md')} /> .md (plain
              markdown)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-fg">
              <input type="radio" checked={format === 'mdx'} onChange={() => onFormatChange('mdx')} /> .mdx (with
              components)
            </label>
          </div>
          <textarea
            value={bodyText}
            onChange={(e) => onBodyTextChange(e.target.value)}
            placeholder={'# Your title\n\nWrite in plain Markdown. Frontmatter (--- ... ---) is optional — the form below fills it in.'}
            rows={16}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-line bg-elevated p-3 font-mono text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const imgs = Array.from(e.dataTransfer.files).filter((f) => isImageFile(f.name));
              if (imgs.length) onAddImages(imgs);
            }}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-xs text-subtle',
              dragOver ? 'border-accent bg-accent/5' : 'border-line-strong',
            )}
          >
            <ImageIcon className="size-4" /> Drop screenshots here too, or use the image picker below
          </div>
        </div>
      )}

      <ImagePicker images={images} onAdd={onAddImages} onRemove={onRemoveImage} />
    </div>
  );
}

function ImagePicker({
  images,
  onAdd,
  onRemove,
}: {
  images: UploadedImage[];
  onAdd: (files: File[]) => void;
  onRemove: (filename: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-fg">
          Images <span className="text-subtle">({images.length})</span>
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <ImageIcon className="size-3.5" /> Add images
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={IMAGE_EXTENSIONS.map((e) => `.${e}`).join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) onAdd(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.filename} className="group relative overflow-hidden rounded-lg border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt={img.originalName} className="aspect-video w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(img.filename)}
                className="absolute right-1 top-1 rounded-md bg-bg/80 p-1 text-fg opacity-0 transition-opacity hover:text-red group-hover:opacity-100"
                aria-label={`Remove ${img.originalName}`}
              >
                <X className="size-3.5" />
              </button>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <span className="truncate font-mono text-[10px] text-subtle" title={img.filename}>
                  {img.filename}
                </span>
                <span
                  className={cn(
                    'shrink-0 font-mono text-[10px]',
                    img.size > MAX_IMAGE_BYTES ? 'flex items-center gap-0.5 text-amber' : 'text-subtle',
                  )}
                >
                  {img.size > MAX_IMAGE_BYTES && <AlertTriangle className="size-2.5" />}
                  {formatBytes(img.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
