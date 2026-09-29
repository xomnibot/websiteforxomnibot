/**
 * Unicode-safe base64 helpers, shared by the GitHub client. Implemented by
 * hand (chunked `String.fromCharCode`) instead of relying on `btoa`/`atob`
 * so behavior is identical in the browser and under plain Node during unit
 * tests, and large files don't blow the call stack.
 */

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  if (typeof btoa === 'function') return btoa(binary);
  // Node fallback (no global btoa in some runtimes).
  return Buffer.from(binary, 'binary').toString('base64');
}

export function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/\n/g, '');
  const binary = typeof atob === 'function' ? atob(clean) : Buffer.from(clean, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** UTF-8 text -> base64, correct for any unicode content. */
export function textToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

/** base64 -> UTF-8 text. */
export function base64ToText(base64: string): string {
  return new TextDecoder().decode(base64ToBytes(base64));
}

/** Reads a File/Blob and returns its raw bytes as base64. */
export async function fileToBase64(file: Blob): Promise<string> {
  const buf = await file.arrayBuffer();
  return bytesToBase64(new Uint8Array(buf));
}
