import { act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useDeleteRecipe, useUpdateRecipeRating } from './recipes.commands';
import { deleteRecipe, updateRecipeRating } from '../../services/recipes.service';

jest.mock('../../services/recipes.service', () => ({
  deleteRecipe: jest.fn(),
  updateRecipeRating: jest.fn(),
}));

const wrapper = (client: QueryClient) => ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

describe('recipes commands', () => {
  test('delete invalidates recipes query', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (deleteRecipe as jest.Mock).mockResolvedValue(true);

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useDeleteRecipe(onError, onSuccess), {
      wrapper: wrapper(queryClient)
    });

    act(() => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['recipes'] }));
    expect(onSuccess).toHaveBeenCalled();
  });

  test('rating update invalidates recipes query', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (updateRecipeRating as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Salade',
      category: 'ENTREE',
      rating: 4
    });

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useUpdateRecipeRating(onError, onSuccess), {
      wrapper: wrapper(queryClient)
    });

    act(() => {
      result.current.mutate({ id: 1, rating: 4 });
    });

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['recipes'] }));
    expect(onSuccess).toHaveBeenCalled();
  });
});
