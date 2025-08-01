import { NavLink, useNavigate } from 'react-router-dom';
import { RouteDefinition } from '../../Routes.tsx';
import { useUser } from '../../contexts/user/user.context.tsx';
import { logout } from '../../services/user.service.ts';
import './Menu.scss';

export const Menu = ({ routes }: { routes: RouteDefinition[] }) => {
  const { userState, setUserState } = useUser();
  const navigate = useNavigate();

  const navItems = routes
    .filter((route: RouteDefinition) => !!route.id)
    .filter((route: RouteDefinition) => (userState.username !== '' && route.isAuth) || (userState.username === '' && !route.isAuth))
    .map((route: RouteDefinition) => ({
      id: route.id,
      name: route.name,
      path: `/${route.path}`
    }));

  const isLogged = userState.username !== '';

  // TODO to betested
  const disconnect = () => {
    logout()
      .then(() => {
        setUserState({
          username: '',
          firstName: '',
          lastName: '',
          email: ''
        });
        navigate('/');
      })
      .catch((error) => {
        console.error('logout error', error);
      });
  }

  return (
    <div className="main-menu">
      <ul>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#4553d1] rounded-xl m-2 cursor-pointer duration-300 hover:text-white'
          >
            <NavLink
              to={item.path}
              className={({ isActive, isPending }) =>
                isActive
                  ? 'active'
                  : isPending
                    ? 'pending'
                    : ''
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
        {isLogged ?
          (<li>
            <button onClick={disconnect}>Se déconnecter</button>
          </li>)
          : (<></>)
        }
      </ul>
    </div>
  )
}