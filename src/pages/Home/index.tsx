import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { GhostButton } from '@/components/buttons/GhostButton';
import { GithubIcon } from '@/components/common/SocialIcons';
import { siteConfig } from '@/data/siteConfig';
import {
  ShieldAlert,
  BookOpen,
  Code2,
  FileText,
  Send,
  ArrowRight,
  Terminal,
  Cpu,
  Coffee,
  Zap,
  Shield,
  Radio,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <PageContainer className="space-y-24 py-8">
      {/* High-Tech Cyber Hero Screen */}
      <section className="relative pt-6 pb-4">
        {/* Ambient Glowing Background Accent Orbs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Hero Text & Call-To-Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>xomnibot :: RESEARCH_LAB_ONLINE</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-foreground tracking-tight leading-[1.08]">
              Cybersecurity Whiz. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Builder & Vulnerabilities Researcher.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              Passionate about dissecting complex systems, cracking CTF puzzles, analyzing CVE zero-days, and crafting open-source security tooling.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 font-mono text-xs text-muted-foreground pt-1">
              <span className="px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> OS: {siteConfig.persona.favoriteOS}
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
                <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Code: Python • Rust • C++
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
                <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Fuel: Cold Brew & Dark Mode
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/writeups">
                <PrimaryButton size="lg" icon={<ShieldAlert className="w-4.5 h-4.5" />}>
                  Explore Writeups
                </PrimaryButton>
              </Link>
              <Link to="/research">
                <PrimaryButton size="lg" variant="outline" icon={<BookOpen className="w-4.5 h-4.5" />}>
                  Read Research
                </PrimaryButton>
              </Link>
              <a href={siteConfig.socialLinks.github} target="_blank" rel="noreferrer">
                <GhostButton icon={<GithubIcon className="w-4.5 h-4.5" />}>
                  GitHub
                </GhostButton>
              </a>
            </div>
          </div>

          {/* Right Column: Live Simulated Cyber Screen / HUD Terminal */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl glass-panel border border-emerald-500/30 p-5 shadow-2xl backdrop-blur-xl bg-black/80 space-y-4 text-left font-mono text-xs"
            >
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-bold text-emerald-400 ml-1">xomnibot-hud.sh</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" /> LIVE
                </span>
              </div>

              {/* Console Screen Output */}
              <div className="space-y-2 text-emerald-400/90 leading-relaxed">
                <div className="text-zinc-500"># System diagnostic initializing...</div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">&gt;</span>
                  <span>SYSTEM_STATUS: <span className="text-emerald-400 font-bold">ONLINE</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">&gt;</span>
                  <span>ACTIVE_RESEARCH: <span className="text-cyan-300 font-semibold">{siteConfig.currentFocus.currentResearch}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">&gt;</span>
                  <span>ACTIVE_TOOL: <span className="text-amber-300 font-semibold">{siteConfig.currentFocus.activeTool}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">&gt;</span>
                  <span>TARGET_OS: <span className="text-zinc-300">Arch Linux (Hyprland)</span></span>
                </div>
              </div>

              {/* Live Stats Pill Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-center">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-base font-extrabold text-emerald-400 font-sans">50+</div>
                  <div className="text-[10px] text-muted-foreground uppercase">CTF Solved</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-base font-extrabold text-cyan-400 font-sans">10+</div>
                  <div className="text-[10px] text-muted-foreground uppercase">CVE Papers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid — Persona Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Inside the Lab</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">Who I Am & How I Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: My Rig */}
          <div className="p-6 rounded-2xl glass-panel border border-border space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">
                MY RIG
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Daily Lab Setup</h3>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              <li className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Primary OS</span>
                <span className="text-foreground font-semibold whitespace-nowrap">{siteConfig.persona.rig.os}</span>
              </li>
              <li className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Console</span>
                <span className="text-foreground font-semibold whitespace-nowrap">{siteConfig.persona.rig.terminal}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Editor</span>
                <span className="text-foreground font-semibold whitespace-nowrap">{siteConfig.persona.rig.editor}</span>
              </li>
            </ul>
          </div>

          {/* Bento Card 2: Fun Facts */}
          <div className="p-6 rounded-2xl glass-panel border border-border space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-semibold">
                FUN FACTS
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Curiosity In Action</h3>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              {siteConfig.persona.funFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bento Card 3: Security Arsenal */}
          <div className="p-6 rounded-2xl glass-panel border border-border space-y-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-semibold">
                TOOL ARSENAL
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Favorite Software</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {siteConfig.persona.favoriteSecurityTools.map((tool, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-foreground font-medium whitespace-nowrap">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Category Launchpads */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/writeups"
          className="p-6 rounded-2xl glass-panel border border-border hover:border-emerald-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-base text-foreground group-hover:text-emerald-400 whitespace-nowrap">
                CTF Writeups
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Machine Walkthroughs</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/research"
          className="p-6 rounded-2xl glass-panel border border-border hover:border-cyan-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-base text-foreground group-hover:text-cyan-400 whitespace-nowrap">
                CVE Research
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Kernel & Browser Papers</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/projects"
          className="p-6 rounded-2xl glass-panel border border-border hover:border-purple-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-base text-foreground group-hover:text-purple-400 whitespace-nowrap">
                Tools Vault
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Security Tools & AI</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/cheatsheets"
          className="p-6 rounded-2xl glass-panel border border-border hover:border-amber-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-base text-foreground group-hover:text-amber-400 whitespace-nowrap">
                Cheat Sheets
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Command References</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Connect Banner — Pushed lower down */}
      <section className="pt-12 mt-16">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/20 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
          <div className="space-y-2">
            <span className="px-3.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/30 uppercase font-semibold">
              Let&apos;s Stay Connected 🚀
            </span>
            <h2 className="text-2xl font-bold font-heading text-foreground">
              Get Fresh Technical Drops & Research Papers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              No corporate fluff, no spam — just pure code, tools, and research notes whenever I drop something new.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Welcome aboard! Thanks for joining!');
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              placeholder="your.email@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-emerald-400"
            />
            <PrimaryButton type="submit" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
              Subscribe
            </PrimaryButton>
          </form>
        </div>
      </section>
    </PageContainer>
  );
};

export default HomePage;
