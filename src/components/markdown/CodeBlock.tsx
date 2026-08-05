import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-diff';
import { CopyButton } from '@/components/buttons/CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'bash', filename }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
      {/* CodeBlock Header */}
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="font-semibold text-emerald-400 uppercase">{language}</span>
          {filename && <span className="text-zinc-500">• {filename}</span>}
        </div>
        <CopyButton text={code} />
      </div>

      {/* Code Snippet Output */}
      <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-zinc-100 leading-relaxed bg-transparent my-0">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};
