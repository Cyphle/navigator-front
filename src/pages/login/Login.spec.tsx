import { render, screen } from '../../../test-utils';
import { Login } from './Login.tsx';
import { fireEvent, waitFor } from '@testing-library/react';
import { useLogin } from '../../stores/login/login.commands.ts';

jest.mock('../../stores/login/login.commands.ts', () => ({
  useLogin: jest.fn().mockImplementation(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../contexts/user/user.context.tsx', () => ({
  useUser: jest.fn().mockImplementation(() => ({
    setUserState: jest.fn(),
  })),
}));

describe('Login page', () => {
  beforeEach(() => {
    (useLogin as jest.Mock).mockClear();
  });

  test('should render login', () => {
    render(<Login />);

    const loginText = screen.getByText('Connecte toi');

    expect(loginText).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    const mockMutate = jest.fn();
    (useLogin as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
    }));
    render(<Login/>);

    const usernameInput = screen.getByTestId('username-input');

    fireEvent.change(usernameInput, { target: { value: 'johndoe', }, });

    const submit = screen.getByRole('button', { name: 'Connexion' });
    fireEvent.click(submit);

    await waitFor(() => {expect(usernameInput).toHaveValue('johndoe');});
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'johndoe',
        password: 'passpass',
      });
    });
  });
});