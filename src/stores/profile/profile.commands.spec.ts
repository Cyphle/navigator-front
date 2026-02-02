import { CreateProfileRequest } from './profile.types.ts';
import { createProfile } from '../../services/profile.service.ts';
import { renderMutateHook } from '../../../test-utils/render.tsx';
import { useCreateProfile } from './profile.commands.ts';
import { waitFor } from '@testing-library/react';

jest.mock('../../services/profile.service.ts', () => ({
  createProfile: jest.fn(),
}));

describe('useCreateProfile', () => {
  const onError = jest.fn();
  const onSuccess = jest.fn();

  const request: CreateProfileRequest = {
    username: 'johndoe',
    email: 'johndoe@banana.fr',
    first_name: 'John',
    last_name: 'Doe',
    password: 'passpass',
  };

  beforeEach(() => {
    (createProfile as jest.Mock).mockClear();
  });

  it('should create profile', async () => {
    const { result } = renderMutateHook(() => useCreateProfile(onError, onSuccess));
    (createProfile as jest.Mock).mockImplementation(() => Promise.resolve());

    result.current.mutate(request);

    await waitFor(() => expect(createProfile).toHaveBeenCalledWith(request));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('should handle error when it has a message', async () => {
    const errorResponse = {
      response: {
        data: {
          error: 'Internal Server Error',
        },
        status: 500,
      },
    };
    (createProfile as jest.Mock).mockImplementation(() => Promise.reject(errorResponse));

    const { result } = renderMutateHook(() => useCreateProfile(onError, onSuccess));

    result.current.mutate(request);

    await waitFor(() => expect(createProfile).toHaveBeenCalledWith(request));
    await waitFor(() => expect(onError).toHaveBeenCalledWith(errorResponse));
  });

  // it('should invalidate queries after updating asset', async () => {
  //   jest.spyOn(reactRouter, 'useParams').mockReturnValue({
  //     assetIdentifier: 'identifierA',
  //   });
  //   const invalidateQueriesMock = jest.fn();
  //   (useQueryClient as jest.Mock).mockReturnValue({
  //     invalidateQueries: invalidateQueriesMock,
  //   });
  //   (updateAsset as jest.Mock).mockImplementation(() => Promise.resolve());
  //
  //   const { result } = renderMutateHook(() => useUpdateAsset(onError, onSuccess));
  //
  //   result.current.mutate(request);
  //
  //   await waitFor(() => expect(invalidateQueriesMock).toHaveBeenCalledWith({
  //     queryKey: [
  //       'FETCH_ASSET',
  //       'ORGA',
  //       'identifierA',
  //     ],
  //   }));
  //   await waitFor(() => expect(invalidateQueriesMock).toHaveBeenCalledWith({
  //     queryKey: [
  //       'FETCH_ASSET_EXTERNAL_IDENTIFIERS',
  //       'ORGA',
  //       'identifierA',
  //     ],
  //   }));
  //   await waitFor(() => expect(invalidateQueriesMock).toHaveBeenCalledWith({
  //     queryKey: [
  //       'FETCH_HISTORY',
  //       'ORGA',
  //       'identifierA',
  //     ],
  //   }));
  // });
});
