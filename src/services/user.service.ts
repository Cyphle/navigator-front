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
  return getOne(`user/logout`, () => {});
}

// TODO to be tested
export const authenticate = (code: string, sessionState: string, iss: string): Promise<Option<{}>> => {
  return getOne(`login?code=${code}&session_state=${sessionState}&iss=${iss}`, responseToAuthenticate)
    .catch((_: JsonError<HttpError>) => {
      return none;
    });
}

export const responseToAuthenticate = (_: any | undefined): Option<{}> => {
  return some({});
}