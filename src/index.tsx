import { createRoot } from 'react-dom/client';
import { queryClient } from './react-query.config.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Router } from './router.tsx';

const container = document.querySelector('#root');
// @ts-ignore
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={ Router }/>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
