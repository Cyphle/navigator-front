import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  test('renders logo and profile link', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByRole('link', { name: /navigator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });
});
