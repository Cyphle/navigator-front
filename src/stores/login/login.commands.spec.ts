import { renderMutateHook } from '../../../test-utils/render.tsx';
import { waitFor } from '@testing-library/react';
import { LoginRequest } from './login.types.ts';
import { login } from '../../services/login.service.ts';
import { useLogin } from './login.commands.ts';

jest.mock('../../services/login.service.ts', () => ({
  login: jest.fn(),
}));

describe('useLogin', () => {
  const onError = jest.fn();
  const onSuccess = jest.fn();

  const request: LoginRequest = {
    username: 'johndoe',
    password: 'test',
  };

  beforeEach(() => {
    (login as jest.Mock).mockClear();
  });

  it('should login user', async () => {
    const { result } = renderMutateHook(() => useLogin(onError, onSuccess));
    (login as jest.Mock).mockImplementation(() => Promise.resolve());

    result.current.mutate(request);

    await waitFor(() => expect(login).toHaveBeenCalledWith(request));
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
    (login as jest.Mock).mockImplementation(() => Promise.reject(errorResponse));

    const { result } = renderMutateHook(() => useLogin(onError, onSuccess));

    result.current.mutate(request);

    await waitFor(() => expect(login).toHaveBeenCalledWith(request));
    await waitFor(() => expect(onError).toHaveBeenCalledWith(errorResponse));
  });
});