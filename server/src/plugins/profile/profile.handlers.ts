import {Database} from '../../database/database';
import {Profile} from './profile.types';

export const getProfileHandler = (database: Database): Profile => {
  return database.read<Profile>('profiles')[0];
}
