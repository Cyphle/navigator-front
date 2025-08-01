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

jest.mock('../menu/Menu', () => ({
  Menu: () => <div data-testid="menu-component">Menu Component</div>,
}));

jest.mock('../../assets/banana.png', () => 'mocked-banana-image');

jest.mock('../../Routes.tsx', () => ({
  ROUTES_WITHOUT_COMPONENT: [],
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

    // Check if the logo and title are rendered
    const logoLink = screen.getByRole('link', { name: /banana/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    // Check if user info is rendered
    const userInfo = screen.getByText('John Doe');
    expect(userInfo).toBeInTheDocument();

    // Check if Menu component is rendered
    const menuComponent = screen.getByTestId('menu-component');
    expect(menuComponent).toBeInTheDocument();
  });

  test('uses NavLink for the logo', () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'Jane', lastName: 'Smith' },
      setUserState: jest.fn(),
    });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(NavLink).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/' }),
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

