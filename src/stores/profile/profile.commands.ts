import { useMutation } from '@tanstack/react-query';
import { CreateProfileRequest } from './profile.types.ts';
import { createProfile } from '../../services/profile.service.ts';

export const useCreateProfile = (onError: (error?: any) => void, onSuccess: () => void) => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProfileRequest) => createProfile(request),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      // TODO invalidate queries
      // await queryClient.invalidateQueries({
      //   queryKey: [
      //     FETCH_ASSET,
      //     currentOrganization,
      //     assetIdentifier,
      //   ],
      // });
      onSuccess();
    },
  });
};