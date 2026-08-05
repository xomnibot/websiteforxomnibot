import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/data/siteConfig';
import { footerSections } from '@/data/navigation';
import { GithubIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from '@/components/common/SocialIcons';
import { Shield, Rss, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const bodyHeight = document.documentElement.scrollHeight;

      // Reveal footer only when user has scrolled to the very end of the page
      if (windowHeight + scrollY >= bodyHeight - 60) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer
      className={cn(
        'w-full border-t border-border bg-background/95 text-muted-foreground transition-all duration-500 mt-36 sm:mt-52 md:mt-64 pt-20 pb-12',
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4 fill-emerald-500/20" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                xomnibot<span className="text-emerald-400 font-mono text-xs">.in</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <a
                href={siteConfig.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-emerald-400 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-emerald-400 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socialLinks.x}
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="hover:text-emerald-400 transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-emerald-400 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                aria-label="RSS Feed"
                className="hover:text-emerald-400 transition-colors"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer Nav Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center hover:text-emerald-400 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Security Notice */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted-foreground gap-2">
          <div>
            © {new Date().getFullYear()} xomnibot.in. Built for cybersecurity education & open-source research.
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">
              PGP Key
            </Link>
            <span>•</span>
            <a href="/sitemap.xml" className="hover:text-emerald-400 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
