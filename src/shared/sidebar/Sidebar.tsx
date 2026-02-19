import { NavLink } from 'react-router-dom';
import navigatorLogo from '../../assets/navigator.png';
import './Sidebar.scss';
import { Menu } from '../menu/Menu';

export const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <NavLink to="/" className="app-sidebar__logo">
        <img src={navigatorLogo} alt="Navigator logo" />
        <span>Navigator</span>
      </NavLink>

      <Menu />
    </aside>
  );
};
