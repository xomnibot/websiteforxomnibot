import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { GhostButton } from '@/components/buttons/GhostButton';
import { GithubIcon } from '@/components/common/SocialIcons';
import { siteConfig } from '@/data/siteConfig';
import { ShieldAlert, BookOpen, Code2, FileText, Send, ArrowRight, Sparkles, Terminal, Cpu, Coffee, Zap, Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <PageContainer className="space-y-20 py-8">
      {/* Apple-style Centered Persona Hero */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hey! I&apos;m xomnibot 👋</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-foreground tracking-tight leading-[1.08]">
          Security Researcher. <br />
          <span className="text-emerald-400">Builder. Curious Whiz.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl mx-auto">
          I love taking complex systems apart just to see how they work. From breaking CTF challenges for fun to auditing kernel drivers, dissecting browser bugs, and writing open-source security tools — I share everything I learn along the way.
        </p>

        {/* Quick Personal Stat Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-muted-foreground pt-1">
          <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> OS: {siteConfig.persona.favoriteOS}
          </span>
          <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
            <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Code: Python • Rust • C++
          </span>
          <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 whitespace-nowrap">
            <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Fuel: Cold Brew & Dark Mode
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <Link to="/writeups">
            <PrimaryButton size="lg" icon={<ShieldAlert className="w-4.5 h-4.5" />}>
              Explore CTF Writeups
            </PrimaryButton>
          </Link>
          <Link to="/research">
            <PrimaryButton size="lg" variant="outline" icon={<BookOpen className="w-4.5 h-4.5" />}>
              Read CVE Papers
            </PrimaryButton>
          </Link>
          <a href={siteConfig.socialLinks.github} target="_blank" rel="noreferrer">
            <GhostButton icon={<GithubIcon className="w-4.5 h-4.5" />}>
              GitHub Repositories
            </GhostButton>
          </a>
        </div>
      </section>

      {/* Apple Bento Grid — Persona Showcase & Cool Details */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Inside the Lab</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">Who I Am & How I Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: My Rig & Environment */}
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

          {/* Bento Card 2: Cool Fun Facts */}
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

          {/* Bento Card 3: Favorite Security Arsenal */}
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
            <p className="text-xs text-muted-foreground pt-1">
              Plus custom open-source scripts written to automate binary analysis and Active Directory roasting.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Category Portal Launchpads */}
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

      {/* Minimal Apple-style Connect Banner */}
      <section className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/20 text-center space-y-4 max-w-2xl mx-auto">
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
      </section>
    </PageContainer>
  );
};
