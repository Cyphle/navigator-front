import { NavLink } from 'react-router-dom';
import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { Header } from './Header';
import { useUser } from '../../contexts/user/user.context';
import { none, some } from '../../helpers/option';
import { logout } from '../../services/user.service.ts';
import { fireEvent, waitFor } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    NavLink: jest.fn(({ children, to }) => <a href={to}>{children}</a>),
    useNavigate: jest.fn(),
  };
});

jest.mock('../../contexts/user/user.context.tsx', () => ({
  useUser: jest.fn(),
  setUserState: jest.fn(),
}));

jest.mock('../../services/user.service.ts', () => ({
  logout: jest.fn(),
}));

describe('Header Component', () => {
  const someUserInfo = some({ firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john.doe@example.com' });
  const mockNavigate = jest.fn();

  beforeEach(() => {
    const { useNavigate } = jest.requireMock('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'John', lastName: 'Doe' },
      setUserState: jest.fn(),
    });
    mockNavigate.mockClear();
    (logout as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders the header with correct elements', () => {
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    // Check if the title is rendered
    const title = screen.getByText('Dashboard');
    expect(title).toBeInTheDocument();

    // Check if profile link is rendered
    const profileLink = screen.getByRole('link', { name: /john doe/i });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  test('uses NavLink for the profile', () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'Jane', lastName: 'Smith' },
      setUserState: jest.fn(),
    });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(NavLink).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/profile' }),
      expect.anything()
    );
  });

  test('displays user information from useUser hook', () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'Jane', lastName: 'Smith' },
      setUserState: jest.fn(),
    });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    const userInfo = screen.getByText('Jane Smith');
    expect(userInfo).toBeInTheDocument();

    expect(useUser).toHaveBeenCalled();
  });

  test('calls setUserState with userInfo when userInfo is Some', () => {
    const mockSetUserState = jest.fn();
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'John', lastName: 'Doe' },
      setUserState: mockSetUserState
    });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(mockSetUserState).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com'
    });
  });

  test('does not call setUserState when userInfo is Some(undefined)', () => {
    const mockSetUserState = jest.fn();
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'John', lastName: 'Doe' },
      setUserState: mockSetUserState
    });

    renderWithRouter(<Header userInfo={none}/>);

    expect(mockSetUserState).not.toHaveBeenCalled();
  });

  test('shows logout button when user is logged in', () => {
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  test('does not show logout button when user is not logged in', () => {
    renderWithRouter(<Header userInfo={none}/>);

    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  test('logs out and redirects to registration', async () => {
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/registration');
    });
  });
});
