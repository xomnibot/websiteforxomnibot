/** Shared types for the /admin React app. */
import type { CollectionKey } from '@/lib/schemas';

export type { CollectionKey };

export interface UploadedImage {
  /** Sanitized filename used on disk under public/media/<collection>/<slug>/ */
  filename: string;
  /** Original filename as dropped/selected, for matching references in the body. */
  originalName: string;
  file: File;
  /** Object URL for local preview, revoked on unmount. */
  previewUrl: string;
  size: number;
}

export interface GithubRepoInfo {
  owner: string;
  name: string;
  branch: string;
}

export interface CommitFileEntry {
  /** Full repo-relative path, e.g. content/writeups/foo.mdx or public/media/writeups/foo/bar.png */
  path: string;
  /** For text files. Mutually exclusive with contentBase64/sha:null. */
  contentText?: string;
  /** For binary files (already base64-encoded), or omit + sha:null to delete. */
  contentBase64?: string;
  /** Set to null to delete this path in the tree. */
  delete?: boolean;
}

export interface PublishResult {
  commitSha: string;
  commitUrl: string;
  liveUrl: string;
  deploymentsUrl: string;
}

export interface FrontmatterFieldError {
  path: string;
  message: string;
}
