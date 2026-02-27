import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { UserContextProvider } from '../../contexts/user/user.context';
import type { AuthenticatedUser } from '../../contexts/user/user.types';
import { Menu } from './Menu';

describe('Menu', () => {
  const renderMenu = (userState: AuthenticatedUser) => {
    return renderWithRouter(
      <UserContextProvider initialUser={userState}>
        <Menu />
      </UserContextProvider>
    );
  };

  test('renders menu entries when authenticated', () => {
    renderMenu({ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' });

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  test('renders profile link when authenticated', () => {
    renderMenu({ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' });

    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });

  test('renders empty menu when unauthenticated', () => {
    renderMenu({ username: '', email: '', firstName: '', lastName: '' });

    expect(screen.queryByRole('link', { name: /profil/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(document.querySelectorAll('.app-sidebar__title')).toHaveLength(0);
  });
});
