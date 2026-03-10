import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from '../menu/Menu';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnchorLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" className="w-5 h-5">
    <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 6c.55 0 1 .45 1 1v1.28A7.01 7.01 0 0 1 19 19h-2a5 5 0 0 0-4-4.9V19l3 2-1 1.5-2-1.33L11 22.5 10 21l3-2v-4.9A5 5 0 0 0 9 19H7a7.01 7.01 0 0 1 6-6.72V11c0-.55.45-1 1-1Z" />
  </svg>
);

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ isMobileOpen, onMobileClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "text-white flex flex-col gap-10 transition-all duration-300 ease-in-out shrink-0",
          // Mobile: fixed overlay panel
          "fixed inset-y-0 left-0 z-40 h-screen",
          // Desktop: static in document flow
          "lg:static lg:z-auto lg:h-auto lg:min-h-screen",
          // Width
          isCollapsed ? "w-[70px]" : "w-[260px]",
          // Mobile visibility — translate in/out
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{ background: 'var(--stone)' }}
      >
        {/* Desktop collapse toggle */}
        <button
          className="absolute top-5 -right-3 w-6 h-6 border border-white/10 rounded-full text-white grid place-items-center cursor-pointer transition-all duration-200 z-10 hover:border-[var(--sage-light)] hidden lg:grid"
          style={{ background: 'var(--stone)' }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full text-white/60 hover:text-white flex items-center justify-center lg:hidden"
          onClick={onMobileClose}
          aria-label="Fermer le menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className={cn("px-5 pt-7", isCollapsed && "lg:px-3")}>
          <NavLink
            to="/"
            className="flex items-center gap-3 no-underline"
            onClick={onMobileClose}
          >
            {/* Anchor icon in gradient blue box */}
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
            >
              <AnchorLogo />
            </div>

            <span
              className={cn(
                "font-display text-white font-semibold text-lg tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden",
                isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
              )}
            >
              Navigator
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1 px-2", isCollapsed && "lg:px-1")} onClick={onMobileClose}>
          <Menu isCollapsed={isCollapsed} />
        </div>

        {/* Bottom fade */}
        <div className="h-8 shrink-0" />
      </aside>
    </>
  );
};
