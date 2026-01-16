import { ConfigProvider } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserContextProvider } from './contexts/user/user.context.tsx';
import { none, Option } from './helpers/option.ts';
import './main.scss';
import { Footer } from './shared/footer/Footer.tsx';
import { Header } from './shared/header/Header.tsx';
import { Sidebar } from './shared/sidebar/Sidebar.tsx';
import { UserInfo } from './stores/user/user.types.ts';
import { PRIMARY_COLOR } from './theme-variables.ts';
import { useUserInfo } from './stores/user/user.queries.ts';
import { Toaster } from './components/toaster/Toaster.tsx';

// TODO c'est pour load des data avant le chargement de la page
export async function appLoader() {
  return {};
}

const SiteContent = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  return (
    <UserContextProvider>
      <ConfigProvider theme={ { token: { colorPrimary: PRIMARY_COLOR } } }>
        <Toaster>
          <div className="app-shell">
            <Sidebar />
            <div className="app-shell__main">
              <Header userInfo={userInfo}/>
              <main className="app-shell__content">
                <Outlet/>
              </main>
              <Footer/>
            </div>
          </div>
        </Toaster>
      </ConfigProvider>
    </UserContextProvider>
  )
}

const Main = () => {
  const { isPending, isError, data, error } = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = data?.isSome?.() ?? false;

  useEffect(() => {
    if (!isPending && !isAuthenticated && location.pathname === '/') {
      navigate('/registration', { replace: true });
    }
  }, [isPending, isAuthenticated, location.pathname, navigate]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: { error.message }</span>;
  }

  return <SiteContent userInfo={(data ?? none) as Option<UserInfo>} />
}

export default Main;
