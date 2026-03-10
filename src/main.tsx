import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { UserContextProvider } from './contexts/user/user.context.tsx';
import { Option } from './helpers/option.ts';
import '@fontsource-variable/geist';
import './main.scss';
import { Footer } from './shared/footer/Footer.tsx';
import { Header } from './shared/header/Header.tsx';
import { Sidebar } from './shared/sidebar/Sidebar.tsx';
import { UserInfo } from './stores/user/user.types.ts';
import { Toaster as UIProvider } from './components/toaster/Toaster.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { getUserInfo } from './services/user.service.ts';

export async function initialDataLoader() {
  const userInfo = await getUserInfo();
  return { userInfo };
}

const Main = () => {
  const { userInfo } = useLoaderData() as { userInfo: Option<UserInfo> };
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = userInfo.isSome();
  const initialUser = useMemo(() => userInfo.getOrElse({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  }), [userInfo]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/registration', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <UserContextProvider initialUser={initialUser}>
      <UIProvider>
        <Toaster />
        <div className="app-shell">
          <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
          <div className="app-shell__main">
            <Header userInfo={userInfo} onMenuOpen={() => setIsMobileMenuOpen(true)} />
            <main className="app-shell__content">
              <Outlet/>
            </main>
            <Footer/>
          </div>
        </div>
      </UIProvider>
    </UserContextProvider>
  );
}

export default Main;
