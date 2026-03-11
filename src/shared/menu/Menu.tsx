import { NavLink } from 'react-router-dom';
import { ROUTES_PATHS } from '../../Routes';
import type { RouteDefinitionConfig } from '../../Routes';
import { useUser } from '../../contexts/user/user.context';
import { cn } from '@/lib/utils';

/** Dot color per route id — purely visual, matches DESIGN_SPEC section colors */
const DOT_COLORS: Record<number, string> = {
  1: 'var(--ocean-light)',  // Dashboard
  3: 'var(--sage-light)',   // Familles
  4: '#9B8AF4',             // Calendrier partagé
  5: 'var(--sun)',          // Todos familiaux
  6: '#4EC9B0',             // Recettes
  7: 'var(--sage-light)',   // Menus de la semaine
  8: 'var(--coral)',        // Liste de courses
  9: 'var(--ocean-light)',  // Profil
};

const resolvePath = (item: RouteDefinitionConfig): string | undefined => {
  if (item.index) return '/';
  if (!item.path) return undefined;
  return item.path.startsWith('/') ? item.path : `/${item.path}`;
};

export const Menu = () => {
  const { userState } = useUser();
  const isAuthenticated = userState.username !== '';

  if (!isAuthenticated) {
    return (
      <nav className="flex flex-col flex-1" aria-label="Navigation principale">
        <ul className="flex flex-col list-none p-0 m-0" />
      </nav>
    );
  }

  const menuEntries = ROUTES_PATHS
    .filter((route) => !!route.name)
    .filter((route) => route.isAuth);

  return (
    <nav className="flex flex-col flex-1" aria-label="Navigation principale">
      <ul className="flex flex-col list-none p-0 m-0 gap-0.5">
        {menuEntries.map((item) => {
          const path = resolvePath(item);
          const dotColor = item.id ? DOT_COLORS[item.id] : 'var(--ocean-light)';

          const content = (isActive: boolean) => (
            <>
              {/* Active left border — desktop only */}
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-sm hidden lg:block"
                  style={{ background: 'var(--sage-light)' }}
                  aria-hidden="true"
                />
              )}
              {/* Colored dot */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: dotColor }}
                aria-hidden="true"
              />
              {/* Label — desktop only */}
              <span className="hidden lg:block text-sm font-medium whitespace-nowrap overflow-hidden">
                {item.name}
              </span>
            </>
          );

          return (
            <li key={item.id}>
              {path ? (
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    'relative flex items-center gap-3 py-2.5 no-underline transition-all duration-150 rounded-sm',
                    'md:justify-center md:px-0 md:py-3 lg:justify-start lg:px-4',
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
                  )}
                >
                  {({ isActive }) => content(isActive)}
                </NavLink>
              ) : (
                <button
                  className={cn(
                    'relative flex items-center gap-3 py-2.5 text-white/30 cursor-not-allowed opacity-50 w-full text-left rounded-sm',
                    'md:justify-center md:px-0 md:py-3 lg:justify-start lg:px-4',
                  )}
                  type="button"
                  aria-disabled="true"
                >
                  {content(false)}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
