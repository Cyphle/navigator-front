import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/user/user.context.tsx';
import { Option } from '../../helpers/option.ts';
import { UserInfo } from '../../stores/user/user.types.ts';
import { logout } from '../../services/user.service.ts';
import './Header.scss';

export const Header = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  const { userState, setUserState } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    userInfo.apply((userInfo: UserInfo) => {
      setUserState(userInfo);
    });
  }, [setUserState, userInfo]);

  const fullName = `${userState.firstName} ${userState.lastName}`.trim();
  const initials = `${userState.firstName?.[0] ?? ''}${userState.lastName?.[0] ?? ''}` || 'U';
  const isLoggedIn = userInfo.isSome();

  const handleLogout = async () => {
    await logout();
    navigate('/registration');
  };

  return (
    <header className="app-header">
      <div className="app-header__title">
        <h1>Dashboard</h1>
        <p>Gerer la famille au meme endroit</p>
      </div>

      <div className="app-header__actions">
        { isLoggedIn && (
          <button className="app-header__logout" type="button" onClick={ handleLogout }>
            Logout
          </button>
        ) }
        <button className="app-header__icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22a2.5 2.5 0 0 0 2.4-2H9.6A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5-6.7V3a2 2 0 0 0-4 0v1.3A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" />
          </svg>
        </button>
        <NavLink className="app-header__profile" to="/profile">
          <span className="app-header__avatar" aria-hidden="true">{initials}</span>
          <span className="app-header__name">{fullName || 'Utilisateur'}</span>
        </NavLink>
      </div>
    </header>
  );
} 
