import { post } from '../helpers/http.ts';
import { LoginRequest, LoginResponse } from '../stores/login/login.types.ts';

export const login = (request: LoginRequest): Promise<LoginResponse> => {
  return post<LoginRequest, LoginResponse>('login', request, responseToLogin);
}

export const responseToLogin = (data: any): LoginResponse => {
  return {
    username: data.profile.username,
    firstName: data.profile.firstName,
    lastName: data.profile.lastName,
    email: data.profile.email
  }
}