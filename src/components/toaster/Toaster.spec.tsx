import { fireEvent, render, screen } from '@testing-library/react';
import { Toaster, useToaster } from './Toaster';

const toastMock = jest.fn();

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

const TestComponent = () => {
  const { notify } = useToaster();

  return (
    <div>
      <button onClick={() => notify({ type: 'info', title: 'Info', description: 'Detail', duration: 3 })}>
        Info
      </button>
      <button onClick={() => notify({ type: 'warning', title: 'Warning' })}>
        Warning
      </button>
      <button onClick={() => notify({ type: 'error', title: 'Error', description: 'Oops' })}>
        Error
      </button>
    </div>
  );
};

describe('Toaster', () => {
  beforeEach(() => {
    toastMock.mockClear();
  });

  test('should notify info with custom duration', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Info'));

    expect(toastMock).toHaveBeenCalledWith({
      title: 'Info',
      description: 'Detail',
      duration: 3000,
      variant: 'default',
    });
  });

  test('should notify warning with default duration', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Warning'));

    expect(toastMock).toHaveBeenCalledWith({
      title: 'Warning',
      description: undefined,
      duration: 4500,
      variant: 'default',
    });
  });

  test('should notify error with destructive variant', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Error'));

    expect(toastMock).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Oops',
      duration: 4500,
      variant: 'destructive',
    });
  });
});
