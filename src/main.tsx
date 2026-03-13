import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { useMemo } from 'react';
import { UserContextProvider } from './contexts/user/user.context.tsx';
import { FamilyContextProvider, CurrentFamily } from './contexts/family/family.context.tsx';
import { Option } from './helpers/option.ts';
import '@fontsource-variable/geist';
import './main.scss';
import { Footer } from './shared/footer/Footer.tsx';
import { Header } from './shared/header/Header.tsx';
import { Sidebar } from './shared/sidebar/Sidebar.tsx';
import { BottomNav } from './shared/bottom-nav/BottomNav.tsx';
import { UserInfo } from './stores/user/user.types.ts';
import { Toaster as UIProvider } from './components/toaster/Toaster.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { getUserInfo } from './services/user.service.ts';
import { getFamilies } from './services/families.service.ts';

export async function initialDataLoader() {
  const userInfo = await getUserInfo();
  if (!userInfo.isSome()) {
    return redirect('/registration');
  }
  const families = await getFamilies();
  const simpleFamilies: CurrentFamily[] = families.map(f => ({ id: String(f.id), name: f.name }));
  return { userInfo, families: simpleFamilies };
}

const Main = () => {
  const { userInfo, families } = useLoaderData() as { userInfo: Option<UserInfo>; families: CurrentFamily[] };

  const initialUser = useMemo(() => userInfo.getOrElse({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  }), [userInfo]);

  return (
    <UserContextProvider initialUser={initialUser}>
      <FamilyContextProvider initialFamilies={families}>
        <UIProvider>
          <Toaster />
          <div className="app-shell h-screen overflow-hidden">
            <Sidebar />
            <div className="app-shell__main overflow-hidden">
              <Header userInfo={userInfo} />
              <main className="app-shell__content overflow-y-auto pb-[72px] md:pb-0">
                <Outlet/>
              </main>
              <Footer/>
            </div>
          </div>
          <BottomNav />
        </UIProvider>
      </FamilyContextProvider>
    </UserContextProvider>
  );
}

export default Main;
