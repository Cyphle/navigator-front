import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { ROUTES_CATEGORIES } from '../../Routes';
import { Menu } from './Menu';

describe('Menu', () => {
  test('renders categories in ROUTES_CATEGORIES order', () => {
    renderWithRouter(<Menu />);

    const titles = Array.from(document.querySelectorAll('.app-sidebar__title'))
      .map((element) => element.textContent);
    expect(titles).toEqual(ROUTES_CATEGORIES.map((category) => category.name));
  });

  test('renders profile link', () => {
    renderWithRouter(<Menu />);

    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });

  test('renders registration entry even without an icon', () => {
    renderWithRouter(<Menu />);

    expect(screen.getByRole('link', { name: /s'inscrire/i })).toHaveAttribute('href', '/registration');
  });
});
