import { screen } from '../../../test-utils';
import { renderWithRouter } from '../../../test-utils/render';
import { UserContextProvider } from '../../contexts/user/user.context';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  test('renders logo and profile link', () => {
    renderWithRouter(
      <UserContextProvider initialUser={{ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' }}>
        <Sidebar />
      </UserContextProvider>
    );

    expect(screen.getByRole('link', { name: /navigator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });
});
