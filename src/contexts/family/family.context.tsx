import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

export type CurrentFamily = { id: string; name: string };

interface FamilyContextType {
  currentFamily: CurrentFamily | null;
  families: CurrentFamily[];
  setCurrentFamily: Dispatch<SetStateAction<CurrentFamily | null>>;
}

const FamilyContext = createContext<FamilyContextType>({} as FamilyContextType);

export const FamilyContextProvider = ({
  children,
  initialFamilies,
}: PropsWithChildren<{ initialFamilies: CurrentFamily[] }>) => {
  const [families] = useState<CurrentFamily[]>(initialFamilies);
  const [currentFamily, setCurrentFamily] = useState<CurrentFamily | null>(initialFamilies[0] ?? null);

  return (
    <FamilyContext.Provider value={{ currentFamily, families, setCurrentFamily }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => useContext(FamilyContext);
