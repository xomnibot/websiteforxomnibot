import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { MobileNav } from '@/components/navigation/MobileNav';
import { useSearch } from '@/hooks/useSearch';
import { useTheme } from '@/hooks/useTheme';
import { Search, Sun, Moon, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openSearch } = useSearch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Desktop Nav with generous separation */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 mr-6 sm:mr-8 lg:mr-12">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-emerald-500/20" />
            </div>
            <div className="flex items-baseline font-heading font-bold text-xl tracking-tight text-foreground">
              <span>xomnibot</span>
              <span className="text-emerald-400 font-mono text-sm ml-0.5">.in</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />
        </div>

        {/* Right Action Icons & Command Search with wide gap after Contact */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-6 lg:ml-12 xl:ml-16">
          {/* Command Palette Trigger - Guaranteed Single Line */}
          <button
            onClick={openSearch}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-background border border-border rounded text-foreground font-semibold whitespace-nowrap">
              Ctrl + K
            </kbd>
          </button>

          <button
            onClick={openSearch}
            aria-label="Search"
            className="sm:hidden p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Search className="w-5 h-5 text-emerald-400" />
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Mobile Hamburger Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
