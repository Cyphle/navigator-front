import { NavLink } from 'react-router-dom';
import { Menu } from '../menu/Menu';

const AnchorLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" className="w-5 h-5">
    <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 6c.55 0 1 .45 1 1v1.28A7.01 7.01 0 0 1 19 19h-2a5 5 0 0 0-4-4.9V19l3 2-1 1.5-2-1.33L11 22.5 10 21l3-2v-4.9A5 5 0 0 0 9 19H7a7.01 7.01 0 0 1 6-6.72V11c0-.55.45-1 1-1Z" />
  </svg>
);

export const Sidebar = () => {
  return (
    <aside
      className="hidden md:flex text-white flex-col gap-10 shrink-0 md:w-[60px] lg:w-[260px] transition-all duration-300 min-h-screen sticky top-0 h-screen"
      style={{ background: 'var(--stone)' }}
    >
      {/* Logo */}
      <div className="px-0 lg:px-5 pt-7 flex justify-center lg:justify-start">
        <NavLink
          to="/"
          className="flex items-center gap-3 no-underline"
        >
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
          >
            <AnchorLogo />
          </div>
          <span className="hidden lg:inline font-display text-white font-semibold text-lg tracking-wide whitespace-nowrap overflow-hidden">
            Navigator
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-1 lg:px-2">
        <Menu />
      </div>

      {/* Bottom fade */}
      <div className="h-8 shrink-0" />
    </aside>
  );
};
