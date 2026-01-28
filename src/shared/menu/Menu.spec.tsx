import { renderWithRouter } from "../../../test-utils/render";
import { screen } from "@testing-library/react";
import { Menu } from "./Menu";
import { RouteDefinition } from "../../Routes";
import { UserContextProvider } from "../../contexts/user/user.context";
import { AuthenticatedUser } from "../../contexts/user/user.types";

describe('Menu Component', () => {
  const menuItems: RouteDefinition[] = [
    { id: 1, path: '/accounts', name: 'Mes comptes', isAuth: true },
    { id: 2, path: '/profile', name: 'Profil', isAuth: true },
    { id: 3, path: '/subscribe', name: 'S\'inscrire', isAuth: false },
    { id: 4, path: '/login', name: 'Se connecter', isAuth: false }
  ];

  const renderMenu = (userState: AuthenticatedUser) => {
    return renderWithRouter(
      <UserContextProvider initialUser={userState}>
        <Menu routes={menuItems} />
      </UserContextProvider>
    );
  };

  test('renders public menu items when user is logged out', () => {
    renderMenu({ username: '', email: '', firstName: '', lastName: '' });

    menuItems.filter((item) => !item.isAuth).forEach((item: RouteDefinition) => {
      const menuItem = screen.getByText(item.name ?? '');
      expect(menuItem).toBeInTheDocument();
    });
  });

  test('renders NavLinks with correct paths when user is logged out', () => {
    renderMenu({ username: '', email: '', firstName: '', lastName: '' });

    menuItems.filter((item) => !item.isAuth).forEach(({ name, path }) => {
      const link = screen.getByRole('link', { name: name });
      expect(link).toHaveAttribute('href', `/${path}`);
    });
  });

  test('applies correct CSS classes to menu items', () => {
    renderMenu({ username: '', email: '', firstName: '', lastName: '' });

    const item = screen.getAllByRole('listitem');
    item.forEach(item => {
      expect(item).toHaveClass('p-4', 'hover:bg-[#4553d1]', 'rounded-xl', 'm-2', 'cursor-pointer', 'duration-300', 'hover:text-white');
    });
  });
});
