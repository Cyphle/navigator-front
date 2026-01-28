// ./test-utils/render.tsx
import {
  getByTestId,
  render as testingLibraryRender,
  renderHook as testingLibraryRenderHook
} from '@testing-library/react';
import { PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult
} from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

export const render = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: PropsWithChildren) => {
    return (
      <QueryClientProvider client={ queryClient }>
        <div data-testid="test-container">{ children }</div>
      </QueryClientProvider>
    );
  };

  const rendered = testingLibraryRender(<>{ ui }</>, { wrapper });

  return {
    ...rendered,
    container: Array.from(getByTestId(rendered.container, 'test-container').children).filter((e) => e.tagName !== 'STYLE')[0],
  };
};

export const renderQueryHook = (hook: () => UseQueryResult) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider
    client={ queryClient }>{ children }</QueryClientProvider>;

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderInfiniteQueryHook = (hook: () => UseInfiniteQueryResult) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider
    client={ queryClient }>{ children }</QueryClientProvider>;

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderMutateHook = <TData, TError, TVariables, TContext>(hook: () => UseMutationResult<TData, TError, TVariables, TContext>) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider
    client={ queryClient }>{ children }</QueryClientProvider>;

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};
