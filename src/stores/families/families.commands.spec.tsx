import { act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useCreateFamily, useUpdateFamily } from './families.commands';
import { createFamily, updateFamily } from '../../services/families.service';

jest.mock('../../services/families.service', () => ({
  createFamily: jest.fn(),
  updateFamily: jest.fn(),
}));

const wrapper = (client: QueryClient) => ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

describe('families commands', () => {
  test('create invalidates families query', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (createFamily as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Famille Martin',
      owner: { id: 1, email: 'owner@banana.fr', role: 'Owner', relation: 'Owner' },
      members: [],
      status: 'ACTIVE'
    });

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useCreateFamily(onError, onSuccess), {
      wrapper: wrapper(queryClient)
    });

    act(() => {
      result.current.mutate({
        name: 'Famille Martin',
        ownerEmail: 'owner@banana.fr',
        ownerName: 'Owner',
        memberEmails: []
      });
    });

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['families'] }));
    expect(onSuccess).toHaveBeenCalled();
  });

  test('update invalidates families query', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (updateFamily as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Famille Update',
      owner: { id: 1, email: 'owner@banana.fr', role: 'Owner', relation: 'Owner' },
      members: [],
      status: 'ACTIVE'
    });

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useUpdateFamily(onError, onSuccess), {
      wrapper: wrapper(queryClient)
    });

    act(() => {
      result.current.mutate({
        id: 1,
        name: 'Famille Update',
        ownerEmail: 'owner@banana.fr',
        ownerName: 'Owner',
        memberEmails: []
      });
    });

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['families'] }));
    expect(onSuccess).toHaveBeenCalled();
  });
});
