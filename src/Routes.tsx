import { createBrowserRouter } from 'react-router-dom';
import Main, { appLoader } from './main.tsx';
import { AccountPage, accountParamsLoader } from './pages/account/Account.tsx';
import { AccountsPage } from './pages/accounts/Accounts.tsx';
import { Home } from './pages/home/Home.tsx';
import { Login } from './pages/login/Login.tsx';
import { Profile } from './pages/profile/Profile.tsx';
import { Registration } from './pages/registration/Registration.tsx';
import ErrorPage from './shared/ErrorPage.tsx';

export interface RouteDefinition {
  id?: number;
  index?: boolean;
  path?: string;
  name?: string;
  isAuth: boolean;
}

export interface RouteDefinitionWithComponent extends RouteDefinition {
  element: React.ReactNode;
  loader?: ({ params }: { params: { [key: string]: string } }) => Promise<any>;
}

export const ROUTES_PATHS: RouteDefinitionWithComponent[] = [
  { 
    index: true, 
    element: <Home />,
    isAuth: false
  },
  {
    id: 1,
    path: 'accounts',
    element: <AccountsPage />,
    name: 'Mes comptes',
    isAuth: true
  },
  {
    path: 'accounts/:id',
    element: <AccountPage />,
    loader: accountParamsLoader,
    isAuth: true
  },
  {
    id: 2,
    path: 'profile',
    element: <Profile />,
    name: 'Profil',
    isAuth: true
  },
  {
    id: 3,
    path: 'registration',
    element: <Registration />,
    name: 'S\'inscrire',
    isAuth: false
  },
  {
    id: 4,
    path: 'login',
    element: <Login />,
    name: 'Se connecter',
    isAuth: false
  }
];

const ROUTES = [
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    loader: appLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: ROUTES_PATHS
      }
    ]
  },
];

export const ROUTES_WITHOUT_COMPONENT: RouteDefinition[] = ROUTES_PATHS
  .map((route: RouteDefinitionWithComponent) => ({
    id: route.id,
    index: route.index,
    path: route.path,
    name: route.name,
    isAuth: route.isAuth
  }));

// @ts-ignore
export const Router = createBrowserRouter(ROUTES);