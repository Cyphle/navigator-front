import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/user/user.context.tsx';
import { Option } from '../../helpers/option.ts';
import { UserInfo } from '../../stores/user/user.types.ts';
import { logout } from '../../services/user.service.ts';
import { redirectToLogin } from '../../helpers/navigation.ts';
import './Header.scss';

export const Header = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  const { userState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = `${userState.firstName} ${userState.lastName}`.trim();
  const initials = `${userState.firstName?.[0] ?? ''}${userState.lastName?.[0] ?? ''}` || 'U';
  const isLoggedIn = userInfo.isSome();

  const handleLogout = async () => {
    await logout();
    navigate('/registration');
  };

  const headerContent = (() => {
    if (location.pathname.startsWith('/families')) {
      return {
        title: 'Familles',
        subtitle: 'Mes familles, pour vivre ensemble'
      };
    }

    if (location.pathname.startsWith('/calendars')) {
      return {
        title: 'Mes calendriers',
        subtitle: 'Pour gérer mon temps et celui de ma famille'
      };
    }

    if (location.pathname.startsWith('/family-todos')) {
      return {
        title: 'To do lists',
        subtitle: 'Mes tâches et celles de ma famille'
      };
    }

    if (location.pathname.startsWith('/shopping-lists')) {
      return {
        title: 'Listes de course',
        subtitle: 'Acheter acheter acheter ! Pour ma famille et moi'
      };
    }

    if (location.pathname.startsWith('/weekly-menus')) {
      return {
        title: 'Recettes de la semaine et plus',
        subtitle: 'Pour bien manger dans les jours à venir'
      };
    }

    if (location.pathname.startsWith('/recipes')) {
      return {
        title: 'Recettes',
        subtitle: 'Mes recettes, celles de ma famille mais pas que'
      };
    }

    if (location.pathname.startsWith('/profile')) {
      return {
        title: 'Mon profil',
        subtitle: 'Moi moi et encore moi. Mais aussi nous'
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Gerer la famille au meme endroit'
    };
  })();

  return (
    <header className="app-header">
      <div className="app-header__title">
        <h1>{headerContent.title}</h1>
        <p>{headerContent.subtitle}</p>
      </div>

      <div className="app-header__actions">
        { isLoggedIn ? (
          <>
            <button className="app-header__logout" type="button" onClick={ handleLogout }>
              Logout
            </button>
            <button className="app-header__icon-button" type="button" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22a2.5 2.5 0 0 0 2.4-2H9.6A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5-6.7V3a2 2 0 0 0-4 0v1.3A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" />
              </svg>
            </button>
            <NavLink className="app-header__profile" to="/profile">
              <span className="app-header__avatar" aria-hidden="true">{initials}</span>
              <span className="app-header__name">{fullName}</span>
            </NavLink>
          </>
        ) : (
          <>
            <button className="app-header__logout" type="button" onClick={redirectToLogin}>
              Log in
            </button>
            <button className="app-header__logout" type="button" onClick={() => navigate('/registration')}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
} 
