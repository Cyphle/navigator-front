import { fireEvent, screen, within } from '@testing-library/react';
import { render } from '../../../test-utils';
import { WeeklyMenus } from './WeeklyMenus';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';

jest.mock('../../stores/recipes/recipes.queries.ts', () => ({
  useFetchRecipesPage: jest.fn(),
}));

const recipesPage = {
  items: [
    { id: 1, name: 'Salade', category: 'ENTREE', rating: 4 },
    { id: 2, name: 'Tarte', category: 'DESSERT', rating: 5 },
  ],
  page: 1,
  pageSize: 10,
  total: 2,
};

describe('WeeklyMenus', () => {
  test('renders recipes and allows selection', () => {
    (useFetchRecipesPage as jest.Mock).mockImplementation(() => ({
      data: recipesPage,
      isPending: false,
      isError: false,
    }));

    render(<WeeklyMenus />);

    expect(screen.getByText('Salade')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /ajouter/i })[0]);

    const selected = screen.getByTestId('weekly-menus-selected');
    expect(within(selected).getByText('Recettes sélectionnées')).toBeInTheDocument();
    expect(within(selected).getByText('Salade')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retirer/i }));
    expect(screen.queryByText('Aucune recette sélectionnée.')).toBeInTheDocument();
  });
});
