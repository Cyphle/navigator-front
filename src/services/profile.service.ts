import { CreateProfileRequest, Profile } from '../stores/profile/profile.types.ts';
import { post } from '../helpers/http.ts';

export const createProfile = (request: CreateProfileRequest): Promise<Profile> => {
  return post<CreateProfileRequest, Profile>('register', request, responseToProfile);
}

export const responseToProfile = (data: any): Profile => {
  return {
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  }
}