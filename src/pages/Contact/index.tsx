import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { siteConfig } from '@/data/siteConfig';
import { GithubIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from '@/components/common/SocialIcons';
import { Mail, Key, Send, ShieldCheck } from 'lucide-react';
import { CopyButton } from '@/components/buttons/CopyButton';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    category: 'Research Collaboration',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageContainer className="space-y-12">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <SectionHeader
        badge="Inquiries & Vulnerability Reporting"
        title="Contact & Collaboration"
        subtitle="Reach out for technical research inquiries, open-source collaboration, speaking opportunities, or responsible disclosures."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-border space-y-6">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" /> Send a Professional Inquiry
            </h2>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 font-mono">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Message Transmitted Successfully</h3>
                <p className="text-xs text-muted-foreground">
                  Thank you for reaching out to xomnibot. Expect a response within 24-48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-emerald-400 hover:underline pt-2 inline-block"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Security Researcher / Developer"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="researcher@org.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase">Organization (Optional)</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Company / University"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase">Inquiry Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Research Collaboration">Research Collaboration</option>
                      <option value="Vulnerability Disclosure">Vulnerability Disclosure</option>
                      <option value="Tool Feedback">Tool / Project Feedback</option>
                      <option value="Speaking / Media">Speaking / Media Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your research proposal or inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <PrimaryButton type="submit" fullWidth icon={<Send className="w-4 h-4" />}>
                  Transmit Inquiry
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>

        {/* Public Keys & Channels Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* PGP Security Key */}
          <div className="p-6 rounded-2xl glass-panel border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> PGP Public Security Key
              </h3>
              <CopyButton text="4F9A 8B2C 1D0E 3F4A 5B6C 7D8E 9F0A 1B2C 3D4E 5F6A" />
            </div>
            <p className="text-xs text-muted-foreground">
              For sensitive disclosures, encrypt messages using the xomnibot PGP key fingerprint:
            </p>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              <code>4F9A 8B2C 1D0E 3F4A 5B6C 7D8E 9F0A 1B2C 3D4E 5F6A</code>
            </pre>
          </div>

          {/* Official Social Channels */}
          <div className="p-6 rounded-2xl glass-panel border border-border space-y-4">
            <h3 className="text-sm font-mono font-bold text-foreground">Official Security Channels</h3>

            <div className="space-y-3 text-xs font-mono">
              <a
                href={siteConfig.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-emerald-400 transition-colors text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-emerald-400" /> GitHub Repositories
                </span>
                <span>@xomnibot</span>
              </a>

              <a
                href={siteConfig.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-red-400 transition-colors text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <YoutubeIcon className="w-4 h-4 text-red-500" /> YouTube Channel
                </span>
                <span>@xomnibot</span>
              </a>

              <a
                href={siteConfig.socialLinks.x}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-cyan-400 transition-colors text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <TwitterIcon className="w-4 h-4 text-cyan-400" /> X (Twitter)
                </span>
                <span>@xomnibot</span>
              </a>

              <a
                href={siteConfig.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-blue-400 transition-colors text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-blue-400" /> LinkedIn
                </span>
                <span>/in/xomnibot</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
