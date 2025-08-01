import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import bananaLogo from '../../assets/banana.png';
import { useUser } from '../../contexts/user/user.context.tsx';
import { Option } from '../../helpers/option.ts';
import { ROUTES_WITHOUT_COMPONENT } from '../../Routes.tsx';
import { UserInfo } from '../../stores/user/user.types.ts';
import { Menu } from '../menu/Menu';
import './Header.scss';

export const Header = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  const { userState, setUserState } = useUser();
  
  useEffect(() => {
    userInfo.apply((userInfo: UserInfo) => {
      setUserState(userInfo);
    });
  }, [userInfo]);

  return (
    <header>
      <div className="banana-title">
        <NavLink to="/">
          <img src={bananaLogo} className="logo" alt="Banana logo" />
          <span>Banana</span>
        </NavLink>
      </div>

      <div className="user-info">
        {userState.firstName} {userState.lastName}
      </div>

      <Menu routes={ROUTES_WITHOUT_COMPONENT} />
    </header>
  );
}