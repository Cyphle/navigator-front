import { createRoot } from 'react-dom/client';
import { queryClient } from './react-query.config.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { Router } from './Routes.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';

const container = document.querySelector('#root');
// @ts-ignore
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={ Router }/>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
