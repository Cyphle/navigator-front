import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { ROUTES_CATEGORIES } from '../../Routes';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  test('renders logo, categories in order, and profile link', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByRole('link', { name: /navigator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');

    const titles = Array.from(document.querySelectorAll('.app-sidebar__title'))
      .map((element) => element.textContent);
    expect(titles).toEqual(ROUTES_CATEGORIES.map((category) => category.name));
  });
});
