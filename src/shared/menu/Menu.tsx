import { NavLink } from 'react-router-dom';
import { ROUTES_PATHS } from '../../Routes';
import type { RouteDefinitionConfig } from '../../Routes';
import { useUser } from '../../contexts/user/user.context';
import { cn } from '@/lib/utils';

const getDefaultIcon = (): React.ReactNode | undefined => {
  return ROUTES_PATHS.find((route) => route.name === 'Menus de la semaine')?.icon;
};

const resolvePath = (item: RouteDefinitionConfig): string | undefined => {
  if (item.index) {
    return '/';
  }

  if (!item.path) {
    return undefined;
  }

  return item.path.startsWith('/') ? item.path : `/${item.path}`;
};

interface MenuProps {
  isCollapsed?: boolean;
}

export const Menu = ({ isCollapsed }: MenuProps) => {
  const { userState } = useUser();
  const isAuthenticated = userState.username !== '';

  if (!isAuthenticated) {
    return (
      <nav className="flex flex-col flex-1" aria-label="Navigation principale">
        <ul className="flex flex-col list-none p-0 m-0">
        </ul>
      </nav>
    );
  }

  const menuEntries = ROUTES_PATHS
    .filter((route) => !!route.name)
    .filter((route) => route.isAuth);
  const defaultIcon = getDefaultIcon();

  return (
    <nav className="flex flex-col flex-1" aria-label="Navigation principale">
      <ul className="flex flex-col list-none p-0 m-0 gap-2">
        {menuEntries.map((item) => {
          const path = resolvePath(item);

          return (
            <li key={item.id}>
              {path ? (
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 py-4 px-5 text-gray-400 no-underline transition-all duration-300 border-l-2 border-transparent uppercase font-light text-sm tracking-widest hover:text-white hover:bg-[#111] hover:translate-x-1",
                    isActive && "text-blue-500 bg-[#111] border-blue-500 font-normal",
                    isCollapsed && "justify-center px-3 hover:translate-x-0",
                    isCollapsed && isActive && "bg-transparent border-blue-500 text-blue-500"
                  )}
                >
                  <span className={cn("w-5 h-5 flex items-center justify-center grayscale transition-all duration-300", "active:grayscale-0")}>{item.icon ?? defaultIcon}</span>
                  <span className={cn(
                    "transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  )}>{item.name}</span>
                </NavLink>
              ) : (
                <button
                  className={cn(
                    "flex items-center gap-3 py-4 px-5 text-gray-600 no-underline cursor-not-allowed opacity-50 uppercase font-light text-sm tracking-widest w-full text-left",
                    isCollapsed && "justify-center px-3"
                  )}
                  type="button"
                  aria-disabled="true"
                >
                  <span className="w-5 h-5 flex items-center justify-center grayscale transition-all duration-300">{item.icon ?? defaultIcon}</span>
                  <span className={cn(
                    "transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  )}>{item.name}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
