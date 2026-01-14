import { NavLink } from 'react-router-dom';
import navigatorLogo from '../../assets/navigator.png';
import './Sidebar.scss';

interface SidebarItem {
  label: string;
  to?: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

const sections: SidebarSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        to: '/',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Organisation familiale',
    items: [
      {
        label: 'Calendrier partage',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3v2H5a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3H7Zm12 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z" />
          </svg>
        )
      },
      {
        label: 'Todos familiaux',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10.5 16 17 9.5l-1.4-1.4-5.1 5.1L8.4 11.1 7 12.5Z" />
            <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v12h14V6H5Z" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Repas',
    items: [
      {
        label: 'Recettes',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 4h10a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.8.4L13 17l-4.2 2.9a.5.5 0 0 1-.8-.4V6a2 2 0 0 1 2-2Z" />
          </svg>
        )
      },
      {
        label: 'Menus de la semaine',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Courses',
    items: [
      {
        label: 'Liste de courses',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 6h15l-1.6 9.5a2 2 0 0 1-2 1.7H9.4a2 2 0 0 1-2-1.6L5.4 5H2V3h4l1 3Z" />
            <circle cx="9.5" cy="20" r="1.5" />
            <circle cx="17.5" cy="20" r="1.5" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Compte',
    items: [
      {
        label: 'Profil',
        to: '/profile',
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
          </svg>
        )
      }
    ]
  }
];

export const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <NavLink to="/" className="app-sidebar__logo">
        <img src={navigatorLogo} alt="Navigator logo" />
        <span>Navigator</span>
      </NavLink>

      <nav className="app-sidebar__nav" aria-label="Navigation principale">
        {sections.map((section) => (
          <div key={section.title ?? 'root'} className="app-sidebar__section">
            {section.title ? <p className="app-sidebar__title">{section.title}</p> : null}
            <ul>
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `app-sidebar__item${isActive ? ' is-active' : ''}`
                      }
                    >
                      <span className="app-sidebar__icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ) : (
                    <button
                      className="app-sidebar__item is-disabled"
                      type="button"
                      aria-disabled="true"
                    >
                      <span className="app-sidebar__icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
