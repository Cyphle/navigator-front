import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Accueil',
    dotColor: 'var(--ocean-light)',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="currentColor">
        <path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ),
  },
  {
    to: '/families',
    label: 'Familles',
    dotColor: 'var(--sage-light)',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="currentColor">
        <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.7 0-5 1.3-5 3v2h10v-2c0-1.7-2.3-3-5-3Zm-8 1c-2.2 0-4 1.1-4 2.5V19h8v-1.5C12 16.1 10.2 15 8 15Z" />
      </svg>
    ),
  },
  {
    to: '/calendars',
    label: 'Agenda',
    dotColor: '#9B8AF4',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="currentColor">
        <path d="M7 3v2H5a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3H7Zm12 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z" />
      </svg>
    ),
  },
  {
    to: '/family-todos',
    label: 'Todos',
    dotColor: 'var(--sun)',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="currentColor">
        <path d="M7 12.5 10.5 16 17 9.5l-1.4-1.4-5.1 5.1L8.4 11.1 7 12.5Z" />
        <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v12h14V6H5Z" />
      </svg>
    ),
  },
  {
    to: '/recipes',
    label: 'Recettes',
    dotColor: '#4EC9B0',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="currentColor">
        <path d="M6 4h10a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.8.4L13 17l-4.2 2.9a.5.5 0 0 1-.8-.4V6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
];

export const BottomNav = () => (
  <nav
    className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white flex items-center justify-around h-16"
    style={{ boxShadow: '0 -2px 12px rgba(27,79,138,0.08)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
    aria-label="Navigation principale"
  >
    {NAV_ITEMS.map(({ to, label, dotColor, icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => cn(
          'flex flex-col items-center gap-0.5 px-3 py-2 rounded-[var(--radius-sm)] transition-colors min-w-[52px]',
          isActive ? '' : ''
        )}
      >
        {({ isActive }) => (
          <>
            <div
              className="relative flex items-center justify-center w-6 h-6"
              style={{ color: isActive ? dotColor : 'var(--mist)' }}
            >
              {icon}
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? 'var(--stone)' : 'var(--mist)' }}
            >
              {label}
            </span>
            {isActive && (
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: dotColor }}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </NavLink>
    ))}
  </nav>
);
