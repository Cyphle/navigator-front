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
import { FamilyContextProvider } from '../src/contexts/family/family.context.tsx';

export const TEST_FAMILY_ID = '1';
const testFamilies = [{ id: TEST_FAMILY_ID, name: 'Test Family' }];

export const render = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: PropsWithChildren) => {
    return (
      <QueryClientProvider client={ queryClient }>
        <FamilyContextProvider initialFamilies={testFamilies}>
          <div data-testid="test-container">{ children }</div>
        </FamilyContextProvider>
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
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <FamilyContextProvider initialFamilies={testFamilies}>
        {children}
      </FamilyContextProvider>
    </QueryClientProvider>
  );

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderInfiniteQueryHook = (hook: () => UseInfiniteQueryResult) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <FamilyContextProvider initialFamilies={testFamilies}>
        {children}
      </FamilyContextProvider>
    </QueryClientProvider>
  );

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderMutateHook = <TData, TError, TVariables, TContext>(hook: () => UseMutationResult<TData, TError, TVariables, TContext>) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <FamilyContextProvider initialFamilies={testFamilies}>
        {children}
      </FamilyContextProvider>
    </QueryClientProvider>
  );

  return testingLibraryRenderHook(hook, { wrapper });
};

export const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};
