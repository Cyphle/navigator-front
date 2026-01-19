import { render, screen } from '../../../test-utils';
import { Registration } from './Registration.tsx';
import { fireEvent, waitFor } from '@testing-library/react';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';

jest.mock('../../stores/profile/profile.commands.ts', () => ({
  useCreateProfile: jest.fn().mockImplementation(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('Registration', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // jsdom does not allow direct assignment to window.location.href
    delete (window as { location?: Location }).location;
    (window as { location: { href: string } }).location = { href: '' };
  });

  afterAll(() => {
    (window as { location: Location }).location = originalLocation;
  });

  beforeEach(() => {
    (useCreateProfile as jest.Mock).mockClear();
    (window as { location: { href: string } }).location.href = '';
  });

  test('should render', () => {
    render(<Registration/>);

    expect(screen.getByText('Crée toi un compte')).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    const mockMutate = jest.fn();
    (useCreateProfile as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
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

    expect(window.location.href).toBe('http://localhost:9000/login');
  });
});
