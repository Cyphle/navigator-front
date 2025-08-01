import { renderWithRouter } from "../../../test-utils/render";
import { screen } from "@testing-library/react";
import { Menu } from "./Menu";
import { RouteDefinition } from "../../Routes";

jest.mock('../../assets/banana.png', () => 'mocked-banana-image');

describe('Menu Component', () => {
  const menuItems: RouteDefinition[] = [
    { id: 1, path: '/accounts', name: 'Mes comptes', isAuth: true },
    { id: 2, path: '/profile', name: 'Profil', isAuth: true },
    { id: 3, path: '/subscribe', name: 'S\'inscrire', isAuth: false },
    { id: 4, path: '/login', name: 'Se connecter', isAuth: false }
  ];

  test('renders all menu items', () => {
    renderWithRouter(<Menu routes={menuItems} />);

    menuItems.forEach((item: RouteDefinition) => {
      const menuItem = screen.getByText(item.name ?? '');
      expect(menuItem).toBeInTheDocument();
    });
  });

  test('renders NavLinks with correct paths', () => {
    renderWithRouter(<Menu routes={menuItems} />);

    menuItems.forEach(({ name, path }) => {
      const link = screen.getByRole('link', { name: name });
      expect(link).toHaveAttribute('href', `/${path}`);
    });
  });

  test('applies correct CSS classes to menu items', () => {
    renderWithRouter(<Menu routes={menuItems} />);

    const item = screen.getAllByRole('listitem');
    item.forEach(item => {
      expect(item).toHaveClass('p-4', 'hover:bg-[#4553d1]', 'rounded-xl', 'm-2', 'cursor-pointer', 'duration-300', 'hover:text-white');
    });
  });
});
