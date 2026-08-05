import { useState } from 'react';

export function useCopyToClipboard(resetInterval = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetInterval);
      return true;
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      setIsCopied(false);
      return false;
    }
  };

  return { isCopied, copy };
}
