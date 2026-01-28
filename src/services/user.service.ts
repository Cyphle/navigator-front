import { getOne } from '../helpers/http';
import { UserInfo } from '../stores/user/user.types';
import { none, Option, some } from '../helpers/option';
import { HttpError, JsonError } from '../helpers/error';

export const getUserInfo = (): Promise<Option<UserInfo>> => {
  return getOne(`user/info`, responseToUserInfo)
    .catch((_: JsonError<HttpError>) => {
      return none;
    });
}

export const responseToUserInfo = (data: any | undefined): Option<UserInfo> => {
  if (data === undefined || data === none) {
    return none;
  } else {
    return some({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    })
  }
}

export const logout = (): Promise<void> => {
  return getOne(`logout`, () => {});
}
