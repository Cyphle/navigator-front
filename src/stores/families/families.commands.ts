import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFamily, updateFamily } from '../../services/families.service';
import type { UpsertFamilyRequest } from './families.types';

export const useCreateFamily = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpsertFamilyRequest) => createFamily(request),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['families'] });
      onSuccess();
    },
  });
};

export const useUpdateFamily = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpsertFamilyRequest) => {
      if (!request.id) {
        throw new Error('Family id is required');
      }

      return updateFamily(request.id, request);
    },
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['families'] });
      onSuccess();
    },
  });
};
