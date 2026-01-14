import { NavLink } from 'react-router-dom';
import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { Header } from './Header';
import { useUser } from '../../contexts/user/user.context';
import { none, some } from '../../helpers/option';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    NavLink: jest.fn(({ children, to }) => <a href={to}>{children}</a>),
  };
});

jest.mock('../../contexts/user/user.context.tsx', () => ({
  useUser: jest.fn(),
  setUserState: jest.fn(),
}));

describe('Header Component', () => {
  const someUserInfo = some({ firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john.doe@example.com' });

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'John', lastName: 'Doe' },
      setUserState: jest.fn(),
    });
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
});
