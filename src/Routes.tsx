import { createBrowserRouter } from 'react-router-dom';
import Main, { initialDataLoader } from './main.tsx';
import { Home } from './pages/home/Home.tsx';
import { Registration } from './pages/registration/Registration.tsx';
import ErrorPage from './shared/error/ErrorPage.tsx';

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
    isAuth: true
  },
  {
    id: 1,
    path: 'registration',
    element: <Registration />,
    name: 'S\'inscrire',
    isAuth: false
  }
];

const ROUTES = [
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    loader: initialDataLoader,
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
