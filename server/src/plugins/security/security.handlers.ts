import { Database } from '../../database/database';
import { RegisterRequest } from './security.types';
import { Profile } from '../profile/profile.types';

export const registerHandler = (database: Database) => (request: RegisterRequest): void => {
  const profiles = database.read<Profile>('profiles')
    .sort((a: Profile, b: Profile) => a.id - b.id)
    .reverse();

  const profile: Profile = {
    id: (profiles[0]?.id ?? 0) + 1,
    ...request
  }

  database.create<Profile>('profiles', profile)
}