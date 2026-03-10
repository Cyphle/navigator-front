import { screen, userEvent } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { Header } from './Header';
import { useUser } from '../../contexts/user/user.context';
import { none, some } from '../../helpers/option';
import { logout } from '../../services/user.service.ts';
import { waitFor } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

jest.mock('../../contexts/user/user.context.tsx', () => ({
  useUser: jest.fn(),
}));

jest.mock('../../services/user.service.ts', () => ({
  logout: jest.fn(),
}));

describe('Header Component', () => {
  const someUserInfo = some({ firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john.doe@example.com' });
  const mockNavigate = jest.fn();

  beforeEach(() => {
    const { useNavigate, useLocation } = jest.requireMock('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: '/' });
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'John', lastName: 'Doe' },
      setUserState: jest.fn(),
    });
    mockNavigate.mockClear();
    (logout as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders the header with correct elements', () => {
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('renders families header content', () => {
    const { useLocation } = jest.requireMock('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/families' });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Familles')).toBeInTheDocument();
    expect(screen.getByText('Mes familles, pour vivre ensemble')).toBeInTheDocument();
  });

  test('renders recipes header content', () => {
    const { useLocation } = jest.requireMock('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/recipes' });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Recettes')).toBeInTheDocument();
    expect(screen.getByText('Mes recettes, celles de ma famille mais pas que')).toBeInTheDocument();
  });

  test('renders weekly menus header content', () => {
    const { useLocation } = jest.requireMock('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/weekly-menus' });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Recettes de la semaine et plus')).toBeInTheDocument();
    expect(screen.getByText('Pour bien manger dans les jours à venir')).toBeInTheDocument();
  });

  test('renders profile header content', () => {
    const { useLocation } = jest.requireMock('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/profile' });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Mon profil')).toBeInTheDocument();
    expect(screen.getByText('Moi moi et encore moi. Mais aussi nous')).toBeInTheDocument();
  });

  test('displays user information from useUser hook', () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: { firstName: 'Jane', lastName: 'Smith' },
      setUserState: jest.fn(),
    });

    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(useUser).toHaveBeenCalled();
  });

  test('shows user section when user is logged in', () => {
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('does not show user section when user is not logged in', () => {
    renderWithRouter(<Header userInfo={none}/>);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('logs out and redirects to registration', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Header userInfo={someUserInfo}/>);

    await user.click(screen.getByText('John Doe'));

    await waitFor(() => {
      expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Se déconnecter'));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/registration');
    });
  });
});
