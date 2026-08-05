import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useSearch } from '@/context/SearchContext';
import { YoutubeIcon } from '@/components/common/SocialIcons';
import {
  ShieldAlert,
  Home,
  Search,
  Terminal,
  FileCode,
  Cpu,
  BookOpen,
  Radio,
  RefreshCw,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useSearch();

  const [isScanning, setIsScanning] = useState(false);
  const [terminalText, setTerminalText] = useState<string[]>([]);

  useEffect(() => {
    setTerminalText([
      `[xomnibot-os v3.6] INITIATING PATH TRACE...`,
      `TARGET_URI: "${location.pathname}"`,
      `STATUS: HTTP 404 • OBJECT_NOT_FOUND`,
      `ERROR_CODE: 0x80040404 (UNREACHABLE_NODE)`,
      `RECOMMENDATION: REDIRECT TO HOME OR RUN SEARCH QUERY`,
    ]);
  }, [location.pathname]);

  const handleAutoReroute = () => {
    setIsScanning(true);
    setTerminalText((prev) => [...prev, `[>] ATTEMPTING AUTOMATIC RE-ROUTE...`]);
    setTimeout(() => {
      setTerminalText((prev) => [...prev, `[✓] REROUTE TARGET ACQUIRED. REDIRECTING...`]);
      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 1000);
  };

  return (
    <PageContainer className="relative flex items-center justify-center min-h-[80vh] overflow-hidden py-12">
      {/* Background Animated Cyber Radar Grid */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 dark:opacity-30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-[600px] h-[600px] rounded-full border border-dashed border-emerald-500/40 relative flex items-center justify-center"
        >
          <div className="w-[450px] h-[450px] rounded-full border border-emerald-500/20 flex items-center justify-center" />
          <div className="w-[300px] h-[300px] rounded-full border border-emerald-500/30 flex items-center justify-center" />
          <div className="w-[150px] h-[150px] rounded-full border border-emerald-500/50 flex items-center justify-center" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-500/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-500/30" />
        </motion.div>
      </div>

      {/* Background Giant Animated 404 Text */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.03, 0.08, 0.04], scale: [0.95, 1.05, 0.98] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-[180px] sm:text-[280px] md:text-[360px] font-black text-emerald-500/20 blur-[2px] tracking-widest"
        >
          404
        </motion.span>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel border border-emerald-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl bg-background/80 space-y-8"
        >
          {/* Header & XOmniBot Branding */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full"
              />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-emerald-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/10">
                <ShieldAlert className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                xomnibot :: 404 path unreachable
              </div>

              <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
                Target Node Not Found
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                The requested URL path <code className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-xs">{location.pathname}</code> does not exist on the xomnibot research network.
              </p>
            </div>
          </div>

          {/* Interactive Terminal Output Box */}
          <div className="rounded-xl bg-black/80 border border-emerald-500/30 p-4 font-mono text-xs sm:text-sm space-y-2 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider ml-1 text-emerald-400">
                  xomnibot-terminal
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">TRACE_LOG</span>
            </div>

            <div className="space-y-1.5 pt-1 text-emerald-400/90 font-mono">
              {terminalText.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
                  <span className={line.includes('ERROR') ? 'text-rose-400 font-bold' : ''}>
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <PrimaryButton icon={<Home className="w-4 h-4" />} fullWidth size="lg">
                Command Base
              </PrimaryButton>
            </Link>

            <PrimaryButton
              variant="outline"
              icon={<Search className="w-4 h-4" />}
              onClick={openSearch}
              fullWidth
              size="lg"
              className="sm:w-auto"
            >
              Search Hub
            </PrimaryButton>

            <PrimaryButton
              variant="cyan"
              icon={<RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
              onClick={handleAutoReroute}
              disabled={isScanning}
              fullWidth
              size="lg"
              className="sm:w-auto"
            >
              {isScanning ? 'Rerouting...' : 'Auto Fix'}
            </PrimaryButton>
          </div>

          {/* Quick Jump Directory Grid */}
          <div className="pt-4 border-t border-emerald-500/10 space-y-3">
            <div className="text-center text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Direct Access Signals
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <Link
                to="/writeups"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group"
              >
                <Terminal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Writeups</span>
              </Link>

              <Link
                to="/research"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group"
              >
                <FileCode className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Research</span>
              </Link>

              <Link
                to="/projects"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group"
              >
                <Cpu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Projects</span>
              </Link>

              <Link
                to="/cheatsheets"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group"
              >
                <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Cheatsheets</span>
              </Link>

              <Link
                to="/youtube"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group col-span-2 sm:col-span-1"
              >
                <YoutubeIcon className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">YouTube</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
