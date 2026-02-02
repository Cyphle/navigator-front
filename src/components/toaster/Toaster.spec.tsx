import { fireEvent, render, screen } from '@testing-library/react';
import { Toaster, useToaster } from './Toaster';

const infoMock = jest.fn();
const warningMock = jest.fn();
const errorMock = jest.fn();
const useNotificationMock = jest.fn(() => [
  { info: infoMock, warning: warningMock, error: errorMock },
  <div data-testid="notification-holder" key="holder" />,
]);

jest.mock('antd', () => ({
  notification: {
    useNotification: () => useNotificationMock(),
  },
}));

const TestComponent = () => {
  const { notify } = useToaster();

  return (
    <div>
      <button onClick={ () => notify({ type: 'info', title: 'Info', description: 'Detail', duration: 3 }) }>
        Info
      </button>
      <button onClick={ () => notify({ type: 'warning', title: 'Warning' }) }>
        Warning
      </button>
      <button onClick={ () => notify({ type: 'error', title: 'Error', description: 'Oops' }) }>
        Error
      </button>
    </div>
  );
};

describe('Toaster', () => {
  beforeEach(() => {
    infoMock.mockClear();
    warningMock.mockClear();
    errorMock.mockClear();
  });

  test('should render notification holder', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    expect(screen.getByTestId('notification-holder')).toBeInTheDocument();
  });

  test('should notify info with custom duration', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Info'));

    expect(infoMock).toHaveBeenCalledWith({
      message: 'Info',
      description: 'Detail',
      placement: 'bottomRight',
      duration: 3,
      className: 'navigator-toaster',
    });
  });

  test('should notify warning with default duration', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Warning'));

    expect(warningMock).toHaveBeenCalledWith({
      message: 'Warning',
      placement: 'bottomRight',
      duration: 4.5,
      className: 'navigator-toaster',
    });
  });

  test('should notify error', () => {
    render(
      <Toaster>
        <TestComponent />
      </Toaster>
    );

    fireEvent.click(screen.getByText('Error'));

    expect(errorMock).toHaveBeenCalledWith({
      message: 'Error',
      description: 'Oops',
      placement: 'bottomRight',
      duration: 4.5,
      className: 'navigator-toaster',
    });
  });
});
