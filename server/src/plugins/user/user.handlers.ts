import { Database } from '../../database/database';
import { Profile } from '../profile/profile.types';
import { UserInfo } from './user.types';

export const userInfoByUsernameHandler = (database: Database) => (username: string): UserInfo | undefined => {
  const userInfo = database.readOneByField<Profile>('profiles', 'username', username);
  if (!!userInfo) {
    return {
      username: userInfo.username,
      email: userInfo.email,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name
    };
  } else {
    return undefined;
  }
}
