import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { AuthenticatedUser } from './user.types.ts';

export interface UserContextType {
  userState: AuthenticatedUser;
  setUserState: Dispatch<SetStateAction<AuthenticatedUser>>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [userState, setUserState] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  return (
    <UserContext.Provider value={ { userState, setUserState } }>
      { children }
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
