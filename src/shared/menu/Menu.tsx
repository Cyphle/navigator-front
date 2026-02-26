import { NavLink } from 'react-router-dom';
import { ROUTES_PATHS } from '../../Routes';
import type { RouteDefinitionConfig } from '../../Routes';
import { useUser } from '../../contexts/user/user.context';

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

export const Menu = () => {
  const { userState } = useUser();
  const isAuthenticated = userState.username !== '';

  if (!isAuthenticated) {
    return (
      <nav className="app-sidebar__nav" aria-label="Navigation principale">
        <ul className="app-sidebar__section">
        </ul>
      </nav>
    );
  }

  const menuEntries = ROUTES_PATHS
    .filter((route) => !!route.name)
    .filter((route) => route.isAuth);
  const defaultIcon = getDefaultIcon();

  return (
    <nav className="app-sidebar__nav" aria-label="Navigation principale">
      <ul className="app-sidebar__section">
        {menuEntries.map((item) => {
          const path = resolvePath(item);

          return (
            <li key={item.id}>
              {path ? (
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `app-sidebar__item${isActive ? ' is-active' : ''}`
                  }
                >
                  <span className="app-sidebar__icon">{item.icon ?? defaultIcon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <button
                  className="app-sidebar__item is-disabled"
                  type="button"
                  aria-disabled="true"
                >
                  <span className="app-sidebar__icon">{item.icon ?? defaultIcon}</span>
                  <span>{item.name}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
