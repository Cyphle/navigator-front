import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { ROUTES_CATEGORIES } from '../../Routes';
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

  test('renders categories in ROUTES_CATEGORIES order when authenticated', () => {
    renderMenu({ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' });

    const titles = Array.from(document.querySelectorAll('.app-sidebar__title'))
      .map((element) => element.textContent);
    expect(titles).toEqual(ROUTES_CATEGORIES.map((category) => category.name));
  });

  test('renders profile link when authenticated', () => {
    renderMenu({ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' });

    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });

  test('renders only unauthenticated entries when unauthenticated', () => {
    renderMenu({ username: '', email: '', firstName: '', lastName: '' });

    expect(screen.getByRole('link', { name: /s'inscrire/i })).toHaveAttribute('href', '/registration');
    expect(screen.queryByRole('link', { name: /profil/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Organisation familiale')).not.toBeInTheDocument();
  });
});
