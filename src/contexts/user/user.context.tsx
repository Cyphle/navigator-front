import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';
import { AuthenticatedUser } from './user.types.ts';

export interface UserContextType {
  userState: AuthenticatedUser;
  setUserState: Dispatch<SetStateAction<AuthenticatedUser>>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

const emptyUser: AuthenticatedUser = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
};

export const UserContextProvider = ({
  children,
  initialUser
}: PropsWithChildren<{ initialUser?: AuthenticatedUser }>) => {
  const [userState, setUserState] = useState<AuthenticatedUser>(initialUser ?? emptyUser);

  useEffect(() => {
    setUserState(initialUser ?? emptyUser);
  }, [initialUser]);

  return (
    <UserContext.Provider value={ { userState, setUserState } }>
      { children }
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
