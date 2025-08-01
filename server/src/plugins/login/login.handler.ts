import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { Profile } from '../profile/profile.types';
import { LoginRequest } from './login.types';

export const loginHandler = (database: Database) => (request: CustomFastifyRequest, loginRequest: LoginRequest): Profile => {
  const profile = database.readOneByField<Profile>('profiles', 'username', loginRequest.username);
  // @ts-ignore
  request.session.set('user', profile);
  return profile;
}