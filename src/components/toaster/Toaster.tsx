import './Toaster.scss';
import { notification } from 'antd';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';

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
  const [api, contextHolder] = notification.useNotification();

  const notify = useCallback(
    ({ type, title, description, duration }: ToastPayload) => {
      api[type]({
        message: title,
        description,
        placement: 'bottomRight',
        duration: duration ?? 4.5,
        className: 'navigator-toaster',
      });
    },
    [api],
  );

  return (
    <ToasterContext.Provider value={ { notify } }>
      { contextHolder }
      { children }
    </ToasterContext.Provider>
  );
};

export const useToaster = () => useContext(ToasterContext);
