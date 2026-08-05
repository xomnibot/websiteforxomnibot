import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, RefreshCw, Sparkles } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { contentService } from '@/services/contentService';

interface TerminalLog {
  id: string;
  type: 'command' | 'output' | 'error';
  text: string;
}

export const TerminalWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: '1', type: 'output', text: 'xomnibot interactive playground v2.4' },
    { id: '2', type: 'output', text: 'Type "help" or "whoami" to explore.' },
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLogs: TerminalLog[] = [
      ...logs,
      { id: Date.now().toString(), type: 'command', text: `$ ${cmd}` },
    ];

    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    switch (mainCmd) {
      case 'help':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `COMMANDS:
  help           Display available commands
  whoami         View xomnibot persona & vision
  ls [category]  List assets (writeups, research, projects, cheatsheets)
  cat [slug]     Inspect paper or tool summary
  focus          Display active research projects
  clear          Flush console logs`,
        });
        break;

      case 'whoami':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `[IDENTITY]: xomnibot — security researcher & developer
[MISSION]: ${siteConfig.mission}`,
        });
        break;

      case 'focus':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `[ACTIVE TARGET]: ${siteConfig.currentFocus.activeTarget}
[RESEARCH]: ${siteConfig.currentFocus.currentResearch}
[TOOLING]: ${siteConfig.currentFocus.activeTool}
[NEXT DROP]: ${siteConfig.currentFocus.nextVideo}`,
        });
        break;

      case 'ls':
        if (arg === 'writeups') {
          const items = contentService.getWriteups().map((w) => `[${w.difficulty}] ${w.title} (${w.slug})`);
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: items.join('\n') });
        } else if (arg === 'research') {
          const items = contentService.getResearchPapers().map((r) => `[${r.cve || 'CVE'}] ${r.title} (${r.slug})`);
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: items.join('\n') });
        } else if (arg === 'projects') {
          const items = contentService.getProjects().map((p) => `[${p.language}] ${p.title} (${p.slug})`);
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: items.join('\n') });
        } else {
          newLogs.push({
            id: (Date.now() + 1).toString(),
            type: 'output',
            text: `Directories: writeups/ | research/ | projects/ | cheatsheets/`,
          });
        }
        break;

      case 'cat':
        if (!arg) {
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Error: Specify slug (e.g. cat portswigger-oauth-account-takeover)' });
        } else {
          const w = contentService.getWriteupBySlug(arg);
          const r = contentService.getResearchBySlug(arg);
          const p = contentService.getProjectBySlug(arg);

          if (w) {
            newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: `WRITEUP: ${w.title}\nSUMMARY: ${w.summary}` });
          } else if (r) {
            newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: `RESEARCH: ${r.title}\nCVE: ${r.cve}\nSUMMARY: ${r.summary}` });
          } else if (p) {
            newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: `PROJECT: ${p.title}\nLANG: ${p.language}\nDESC: ${p.description}` });
          } else {
            newLogs.push({ id: (Date.now() + 1).toString(), type: 'error', text: `cat: ${arg}: Not found` });
          }
        }
        break;

      case 'clear':
        setLogs([]);
        setInput('');
        return;

      default:
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for options.`,
        });
        break;
    }

    setLogs(newLogs);
    setInput('');
  };

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl font-mono shadow-2xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'h-[460px]' : 'h-[320px]'
      }`}
    >
      {/* Sleek Minimal Titlebar */}
      <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs text-zinc-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Console
          </span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-400">
          <button
            onClick={() => setLogs([])}
            title="Reset Output"
            className="p-1 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="p-1 hover:text-emerald-400 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Content Log */}
      <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto space-y-2 text-xs leading-relaxed">
        {logs.map((log) => (
          <div
            key={log.id}
            className={
              log.type === 'command'
                ? 'text-emerald-400 font-semibold'
                : log.type === 'error'
                ? 'text-rose-400'
                : 'text-zinc-300 whitespace-pre-wrap'
            }
          >
            {log.text}
          </div>
        ))}

        {/* Command Form Prompt */}
        <form onSubmit={handleCommandSubmit} className="flex items-center mt-2">
          <span className="text-emerald-400 font-semibold mr-2 shrink-0">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type 'help'..."
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none font-mono text-xs"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
