import { useMutation } from '@tanstack/react-query';
import { LoginRequest } from './login.types.ts';
import { login } from '../../services/login.service.ts';
import { AuthenticatedUser } from '../../contexts/user/user.types.ts';

export const useLogin = (onError: (error?: any) => void, onSuccess: (user: AuthenticatedUser) => void) => {
  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onError: (error: any) => onError(error),
    onSuccess: async (data: AuthenticatedUser, _: any, __: any) => {
      onSuccess({ ...data });
      // TODO invalidate queries
    },
  });
};