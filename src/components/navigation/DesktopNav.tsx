import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '@/data/navigation';
import { cn } from '@/lib/utils';

export const DesktopNav: React.FC = () => {
  return (
    <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-3">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg font-sans whitespace-nowrap shrink-0',
              isActive
                ? 'text-emerald-400 bg-emerald-500/10 font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="whitespace-nowrap">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold text-black bg-emerald-400 rounded shrink-0">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-400 rounded-full animate-fadeIn" />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
