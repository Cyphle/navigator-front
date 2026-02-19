import type { ReactNode } from 'react';
import type { LoaderFunction, RouteObject } from 'react-router-dom';
import Main, { initialDataLoader } from './main.tsx';
import { Home } from './pages/home/Home.tsx';
import { Registration } from './pages/registration/Registration.tsx';
import ErrorPage from './shared/error/ErrorPage.tsx';

export const ROUTES_CATEGORIES = [
  {
    name: 'Organisation familiale',
    order: 1
  },
  {
    name: 'Repas',
    order: 2
  },
  {
    name: 'Courses',
    order: 3
  },
  {
    name: 'Configuration',
    order: 4
  }
];

export interface RouteDefinition {
  id?: number;
  index?: boolean;
  path?: string;
  category?: string;
  name?: string;
  isAuth: boolean;
  icon?: ReactNode;
}

export interface RouteDefinitionWithComponent extends RouteDefinition {
  element: ReactNode;
  loader?: LoaderFunction;
}

export interface RouteDefinitionConfig extends RouteDefinition {
  element?: ReactNode;
  loader?: LoaderFunction;
}

export const ROUTES_PATHS: RouteDefinitionConfig[] = [
  { 
    id: 1,
    index: true,
    element: <Home />,
    name: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 2,
    path: 'registration',
    element: <Registration />,
    name: 'S\'inscrire',
    isAuth: false
  },
  {
    id: 3,
    name: 'Calendrier partage',
    category: 'Organisation familiale',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v2H5a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3H7Zm12 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 4,
    name: 'Todos familiaux',
    category: 'Organisation familiale',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12.5 10.5 16 17 9.5l-1.4-1.4-5.1 5.1L8.4 11.1 7 12.5Z" />
        <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v12h14V6H5Z" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 5,
    name: 'Recettes',
    category: 'Repas',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h10a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.8.4L13 17l-4.2 2.9a.5.5 0 0 1-.8-.4V6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 6,
    name: 'Menus de la semaine',
    category: 'Repas',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 7,
    name: 'Liste de courses',
    category: 'Courses',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 6h15l-1.6 9.5a2 2 0 0 1-2 1.7H9.4a2 2 0 0 1-2-1.6L5.4 5H2V3h4l1 3Z" />
        <circle cx="9.5" cy="20" r="1.5" />
        <circle cx="17.5" cy="20" r="1.5" />
      </svg>
    ),
    isAuth: true
  },
  {
    id: 8,
    name: 'Profil',
    path: 'profile',
    category: 'Configuration',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
      </svg>
    ),
    isAuth: true
  }
];

export const ROUTES_WITH_COMPONENT = ROUTES_PATHS
  .filter((route): route is RouteDefinitionWithComponent => !!route.element);

const ROUTE_OBJECTS: RouteObject[] = ROUTES_WITH_COMPONENT.map((route) => ({
  index: route.index,
  path: route.path,
  element: route.element,
  loader: route.loader
}));

export const APP_ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    loader: initialDataLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: ROUTE_OBJECTS
      }
    ]
  },
];
