/**
 * MDX validation for the /admin app: compiles the body with `@mdx-js/mdx` so
 * publish-time errors (unescaped `<`/`{`, unclosed tags, etc.) surface with
 * line numbers before a commit is made, instead of breaking the live build.
 */
import { compile } from '@mdx-js/mdx';

export type MdxFormat = 'md' | 'mdx';

export interface MdxValidationError {
  message: string;
  line?: number;
  column?: number;
  hint?: string;
}

export interface MdxValidationResult {
  ok: boolean;
  error?: MdxValidationError;
}

let gfmPluginPromise: Promise<unknown | null> | null = null;

/** Loads remark-gfm if it's installed; resolves to null otherwise (never throws). */
export function loadGfmPlugin(): Promise<unknown | null> {
  if (!gfmPluginPromise) {
    gfmPluginPromise = import('remark-gfm')
      .then((mod) => mod.default ?? mod)
      .catch(() => null);
  }
  return gfmPluginPromise;
}

const MDX_HINT =
  'In .mdx, a stray "<" or "{" in ordinary text must be escaped (\\< or \\{) or wrapped in backticks — or publish this file as .md instead if it doesn\'t use any components.';

/** Compiles `source` as the given format and reports the first error, if any. */
export async function validateMdx(source: string, format: MdxFormat): Promise<MdxValidationResult> {
  try {
    const remarkGfm = await loadGfmPlugin();
    await compile(source, {
      format,
      remarkPlugins: remarkGfm ? [remarkGfm as never] : [],
    });
    return { ok: true };
  } catch (err) {
    const e = err as { message?: string; line?: number; column?: number; reason?: string };
    return {
      ok: false,
      error: {
        message: e.reason ?? e.message ?? String(err),
        line: e.line,
        column: e.column,
        hint: format === 'mdx' ? MDX_HINT : undefined,
      },
    };
  }
}
