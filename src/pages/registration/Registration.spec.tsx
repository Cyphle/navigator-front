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
  beforeEach(() => {
    (useCreateProfile as jest.Mock).mockClear();
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

    fireEvent.change(usernameInput, { target: { value: 'johndoe', }, });
    fireEvent.change(emailInput, { target: { value: 'johndoe@banana.fr', }, });
    fireEvent.change(firstNameInput, { target: { value: 'John', }, });
    fireEvent.change(lastNameInput, { target: { value: 'Doe', }, });

    const submit = screen.getByRole('button', { name: 'S\'inscrire' });
    fireEvent.click(submit);

    await waitFor(() => {expect(usernameInput).toHaveValue('johndoe');});
    await waitFor(() => {expect(emailInput).toHaveValue('johndoe@banana.fr');});
    await waitFor(() => {expect(firstNameInput).toHaveValue('John');});
    await waitFor(() => {expect(lastNameInput).toHaveValue('Doe');});
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'johndoe',
        email: 'johndoe@banana.fr',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });
});