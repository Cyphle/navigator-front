import { render, screen } from '../../../test-utils';
import { Registration } from './Registration.tsx';
import { fireEvent, waitFor } from '@testing-library/react';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';
import { redirectToLogin } from '../../helpers/navigation.ts';

jest.mock('../../stores/profile/profile.commands.ts', () => ({
  useCreateProfile: jest.fn().mockImplementation(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../helpers/navigation.ts', () => ({
  redirectToLogin: jest.fn(),
}));

describe('Registration', () => {
  beforeEach(() => {
    (useCreateProfile as jest.Mock).mockClear();
    (redirectToLogin as jest.Mock).mockClear();
  });

  test('should render', () => {
    render(<Registration/>);

    expect(screen.getByText('Crée toi un compte')).toBeInTheDocument();
  });

  test.skip('should handle form submission', async () => {
    const mockMutate = jest.fn();
    (useCreateProfile as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: false,
    }));
    render(<Registration/>);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const firstNameInput = screen.getByTestId('firstname-input');
    const lastNameInput = screen.getByTestId('lastname-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: 'johndoe', }, });
    fireEvent.change(emailInput, { target: { value: 'johndoe@banana.fr', }, });
    fireEvent.change(firstNameInput, { target: { value: 'John', }, });
    fireEvent.change(lastNameInput, { target: { value: 'Doe', }, });
    fireEvent.change(passwordInput, { target: { value: 'passpass', }, });

    const submit = screen.getByRole('button', { name: 'S\'inscrire' });
    fireEvent.click(submit);

    await waitFor(() => {expect(usernameInput).toHaveValue('johndoe');});
    await waitFor(() => {expect(emailInput).toHaveValue('johndoe@banana.fr');});
    await waitFor(() => {expect(firstNameInput).toHaveValue('John');});
    await waitFor(() => {expect(lastNameInput).toHaveValue('Doe');});
    await waitFor(() => {expect(passwordInput).toHaveValue('passpass');});
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'johndoe',
        email: 'johndoe@banana.fr',
        first_name: 'John',
        last_name: 'Doe',
        password: 'passpass',
      });
    });
  });

  test('should redirect to server login', () => {
    render(<Registration/>);

    const loginButton = screen.getByRole('button', { name: 'Si vous avez déjà un compte connectez vous' });
    fireEvent.click(loginButton);

    expect(redirectToLogin).toHaveBeenCalled();
  });

  test('should disable submit when form is invalid', () => {
    render(<Registration/>);

    const submit = screen.getByRole('button', { name: 'S\'inscrire' });
    expect(submit).toBeDisabled();
  });

  test.skip('should display error modal when registration fails', async () => {
    (useCreateProfile as jest.Mock).mockImplementation((onError: () => void) => ({
      mutate: () => onError(),
      isPending: false,
    }));

    render(<Registration/>);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const firstNameInput = screen.getByTestId('firstname-input');
    const lastNameInput = screen.getByTestId('lastname-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: 'johndoe', }, });
    fireEvent.change(emailInput, { target: { value: 'johndoe@banana.fr', }, });
    fireEvent.change(firstNameInput, { target: { value: 'John', }, });
    fireEvent.change(lastNameInput, { target: { value: 'Doe', }, });
    fireEvent.change(passwordInput, { target: { value: 'passpass', }, });

    const submit = screen.getByRole('button', { name: 'S\'inscrire' });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong with your registration. Please contact the support.')).toBeInTheDocument();
    });
  });

  test.skip('should redirect to login after success', async () => {
    (useCreateProfile as jest.Mock).mockImplementation((_onError: () => void, onSuccess: () => void) => ({
      mutate: () => onSuccess(),
      isPending: false,
    }));

    render(<Registration/>);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const firstNameInput = screen.getByTestId('firstname-input');
    const lastNameInput = screen.getByTestId('lastname-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: 'johndoe', }, });
    fireEvent.change(emailInput, { target: { value: 'johndoe@banana.fr', }, });
    fireEvent.change(firstNameInput, { target: { value: 'John', }, });
    fireEvent.change(lastNameInput, { target: { value: 'Doe', }, });
    fireEvent.change(passwordInput, { target: { value: 'passpass', }, });

    const submit = screen.getByRole('button', { name: 'S\'inscrire' });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(redirectToLogin).toHaveBeenCalled();
    });
  });
});
