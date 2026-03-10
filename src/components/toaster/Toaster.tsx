import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';

type ToasterType = 'info' | 'warning' | 'error';

export interface ToastPayload {
  type: ToasterType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToasterContextValue {
  notify: (payload: ToastPayload) => void;
}

const ToasterContext = createContext<ToasterContextValue>({
  notify: () => {},
});

export const Toaster = ({ children }: PropsWithChildren) => {
  const { toast } = useToast();

  const notify = useCallback(
    ({ type, title, description, duration }: ToastPayload) => {
      toast({
        title,
        description,
        duration: (duration ?? 4.5) * 1000,
        variant: type === 'error' ? 'destructive' : 'default',
      });
    },
    [toast],
  );

  return (
    <ToasterContext.Provider value={ { notify } }>
      { children }
    </ToasterContext.Provider>
  );
};

export const useToaster = () => useContext(ToasterContext);
