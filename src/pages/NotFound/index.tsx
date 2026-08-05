import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useSearch } from '@/context/SearchContext';
import { ShieldAlert, Home, Search, Radio } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const { openSearch } = useSearch();

  return (
    <PageContainer className="relative flex items-center justify-center min-h-[75vh] overflow-hidden py-8">
      {/* Cyber Screen Background Grid Scan Lines */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-[480px] h-[480px] rounded-full border border-dashed border-emerald-500/30 relative flex items-center justify-center"
        >
          <div className="w-[320px] h-[320px] rounded-full border border-emerald-500/20" />
          <div className="w-[160px] h-[160px] rounded-full border border-emerald-500/40" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-500/20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-500/20" />
        </motion.div>
      </div>

      {/* Cyber Screen Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl glass-panel border border-emerald-500/30 shadow-2xl backdrop-blur-xl bg-background/90 text-center space-y-6"
      >
        {/* Animated Cyber Badge */}
        <div className="relative inline-block">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Minimal Error Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Radio className="w-3 h-3 animate-pulse" />
            404 • SIGNAL LOST
          </div>

          <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">
            Target Page Not Found
          </h1>

          <p className="text-xs font-mono text-muted-foreground">
            <code className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{location.pathname}</code> does not exist on xomnibot.in
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="w-full sm:w-auto">
            <PrimaryButton icon={<Home className="w-4 h-4" />} size="md" fullWidth>
              Return Home
            </PrimaryButton>
          </Link>

          <PrimaryButton
            variant="outline"
            icon={<Search className="w-4 h-4" />}
            onClick={openSearch}
            size="md"
            fullWidth
            className="sm:w-auto"
          >
            Search Hub
          </PrimaryButton>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default NotFoundPage;
