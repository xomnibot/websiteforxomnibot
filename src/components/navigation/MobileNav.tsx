import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '@/data/navigation';
import { Menu, X, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-2xl animate-fadeIn px-6 py-6 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border text-xs font-mono text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>xomnibot.in Navigation Matrix</span>
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-mono font-bold text-black bg-emerald-400 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};
