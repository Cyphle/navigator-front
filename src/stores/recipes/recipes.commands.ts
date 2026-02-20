import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe } from '../../services/recipes.service';

export const useDeleteRecipe = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRecipe(id),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      onSuccess();
    },
  });
};
