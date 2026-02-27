import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import navigatorLogo from '../../assets/navigator.png';
import './Sidebar.scss';
import { Menu } from '../menu/Menu';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
      <button
        className="app-sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isCollapsed ? (
            <path d="M9 5l7 7-7 7" />
          ) : (
            <path d="M15 5l-7 7 7 7" />
          )}
        </svg>
      </button>

      <NavLink to="/" className="app-sidebar__logo">
        <img src={navigatorLogo} alt="Navigator logo" />
        <span>Navigator</span>
      </NavLink>

      <Menu />
    </aside>
  );
};
