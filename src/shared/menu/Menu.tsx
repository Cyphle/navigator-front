import { NavLink } from 'react-router-dom';
import { ROUTES_CATEGORIES, ROUTES_PATHS } from '../../Routes';
import type { RouteDefinitionConfig } from '../../Routes';

interface MenuSection {
  title?: string;
  items: RouteDefinitionConfig[];
}

const getDefaultIcon = (): React.ReactNode | undefined => {
  return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" />
      </svg>
  )
};

const buildSections = (): MenuSection[] => {
  const menuEntries = ROUTES_PATHS.filter((route) => !!route.name);
  const uncategorized = menuEntries.filter((item) => !item.category);
  const categorized = ROUTES_CATEGORIES
    .map((category) => ({
      title: category.name,
      items: menuEntries.filter((item) => item.category === category.name)
    }))
    .filter((section) => section.items.length > 0);

  return [
    ...(uncategorized.length > 0 ? [{ items: uncategorized }] : []),
    ...categorized
  ];
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
  const sections = buildSections();
  const defaultIcon = getDefaultIcon();

  return (
    <nav className="app-sidebar__nav" aria-label="Navigation principale">
      {sections.map((section) => (
        <div key={section.title ?? 'root'} className="app-sidebar__section">
          {section.title ? <p className="app-sidebar__title">{section.title}</p> : null}
          <ul>
            {section.items.map((item) => {
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
        </div>
      ))}
    </nav>
  );
};
