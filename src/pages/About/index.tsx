import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tag } from '@/components/common/Tag';
import { siteConfig } from '@/data/siteConfig';
import { sampleTimeline } from '@/data/timeline';
import { Shield, Terminal, Calendar } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageContainer className="space-y-16">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <SectionHeader
        badge="Brand Identity"
        title="About xomnibot"
        subtitle="A high-quality cybersecurity research platform dedicated to offensive security, vulnerability research, and open-source software."
      />

      {/* Mission & Brand Philosophy */}
      <section className="p-8 sm:p-10 rounded-2xl glass-panel border border-border space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Core Mission</span>
        </div>
        <p className="text-lg sm:text-xl font-heading text-foreground font-semibold leading-relaxed">
          &quot;{siteConfig.mission}&quot;
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          xomnibot.in is engineered as a technical knowledge hub rather than a generic blog. The platform provides security practitioners, CTF players, and developers with rigorous walkthroughs, vulnerability teardowns, and actionable code primitives.
        </p>
      </section>

      {/* Skills Matrix */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <Terminal className="w-6 h-6 text-emerald-400" /> Core Technical Expertise
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl glass-panel border border-border space-y-3">
            <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase">Offensive Security</h3>
            <div className="flex flex-wrap gap-1.5">
              {siteConfig.skills.offensive.map((skill, idx) => (
                <Tag key={idx} variant="green" size="sm">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-border space-y-3">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase">Defensive & Forensic</h3>
            <div className="flex flex-wrap gap-1.5">
              {siteConfig.skills.defensive.map((skill, idx) => (
                <Tag key={idx} variant="cyan" size="sm">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-border space-y-3">
            <h3 className="text-sm font-mono font-bold text-purple-400 uppercase">Engineering & Tools</h3>
            <div className="flex flex-wrap gap-1.5">
              {siteConfig.skills.development.map((skill, idx) => (
                <Tag key={idx} variant="gray" size="sm">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl glass-panel border border-border space-y-3">
            <h3 className="text-sm font-mono font-bold text-amber-400 uppercase">AI Security</h3>
            <div className="flex flex-wrap gap-1.5">
              {siteConfig.skills.aiSecurity.map((skill, idx) => (
                <Tag key={idx} variant="gray" size="sm">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Timeline */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-400" /> Platform Journey & Milestones
        </h2>

        <div className="space-y-6 relative pl-6 border-l-2 border-border">
          {sampleTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-400 border-4 border-background group-hover:scale-125 transition-transform" />
              <div className="p-4 rounded-xl glass-panel border border-border space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">{item.year}</span>
                  <Tag variant="cyan" size="sm">
                    {item.category}
                  </Tag>
                </div>
                <h3 className="font-heading font-bold text-base text-foreground">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
};
