import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { ROUTES_CATEGORIES } from '../../Routes';
import { UserContextProvider } from '../../contexts/user/user.context';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  test('renders logo, categories in order, and profile link', () => {
    renderWithRouter(
      <UserContextProvider initialUser={{ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' }}>
        <Sidebar />
      </UserContextProvider>
    );

    expect(screen.getByRole('link', { name: /navigator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');

    const titles = Array.from(document.querySelectorAll('.app-sidebar__title'))
      .map((element) => element.textContent);
    expect(titles).toEqual(ROUTES_CATEGORIES.map((category) => category.name));
  });
});
