import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Recipes } from './Recipes';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';
import { useDeleteRecipe, useUpdateRecipeRating } from '../../stores/recipes/recipes.commands';

jest.mock('../../stores/recipes/recipes.queries.ts', () => ({
  useFetchRecipesPage: jest.fn(),
}));

jest.mock('../../stores/recipes/recipes.commands.ts', () => ({
  useDeleteRecipe: jest.fn(),
  useUpdateRecipeRating: jest.fn(),
}));

const recipesPage = {
  items: [
    {
      id: 1,
      name: 'Salade de quinoa',
      category: 'ENTREE',
      rating: 4,
      ingredients: ['Quinoa', 'Tomates'],
      steps: ['Cuire le quinoa', 'Mélanger'],
    },
    {
      id: 2,
      name: 'Tarte aux pommes',
      category: 'DESSERT',
      rating: 5,
      imageUrl: 'https://example.com/tarte.jpg',
      parts: [
        {
          name: 'Pâte',
          ingredients: ['Farine', 'Beurre'],
          steps: ['Mélanger', 'Reposer'],
        },
      ],
    },
  ],
  page: 1,
  pageSize: 6,
  total: 2,
};

describe('Recipes', () => {
  beforeEach(() => {
    (useFetchRecipesPage as jest.Mock).mockImplementation(() => ({
      data: recipesPage,
      isPending: false,
      isError: false,
    }));
    (useDeleteRecipe as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
      isPending: false,
    }));
    (useUpdateRecipeRating as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders recipes list with category and fallback icon', () => {
    render(<Recipes />);

    expect(screen.getByText('Toutes les catégories')).toBeInTheDocument();
    expect(screen.getByText('Salade de quinoa')).toBeInTheDocument();
    expect(screen.getByText('Entrée')).toBeInTheDocument();
    expect(screen.getAllByTestId('default-recipe-icon')).toHaveLength(1);
  });

  test('opens recipe detail popin on click', async () => {
    render(<Recipes />);

    fireEvent.click(screen.getByText('Salade de quinoa'));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Ingrédients')).toBeInTheDocument();
    expect(within(dialog).getByText('Quinoa')).toBeInTheDocument();
  });

  test('opens delete confirmation modal and triggers delete', async () => {
    const deleteMutation = jest.fn();
    (useDeleteRecipe as jest.Mock).mockImplementation(() => ({
      mutate: deleteMutation,
      isPending: false,
    }));

    render(<Recipes />);

    fireEvent.click(screen.getAllByRole('button', { name: /supprimer/i })[0]);

    const dialog = await screen.findByRole('dialog', { name: /supprimer la recette/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /confirmer/i }));

    await waitFor(() => {
      expect(deleteMutation).toHaveBeenCalledWith(1);
    });
  });

  test('applies search when pressing enter', async () => {
    render(<Recipes />);

    const searchInput = screen.getByPlaceholderText('Rechercher une recette');
    fireEvent.change(searchInput, { target: { value: 'quinoa' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(useFetchRecipesPage).toHaveBeenLastCalledWith(1, 10, undefined, 'quinoa');
    });
  });

  test('applies search after debounce', async () => {
    jest.useFakeTimers();
    render(<Recipes />);

    const searchInput = screen.getByPlaceholderText('Rechercher une recette');
    fireEvent.change(searchInput, { target: { value: 'tarte' } });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(useFetchRecipesPage).toHaveBeenLastCalledWith(1, 10, undefined, 'tarte');
    });
  });

  test('updates rating when selecting stars', async () => {
    const updateRating = jest.fn();
    (useUpdateRecipeRating as jest.Mock).mockImplementation(() => ({
      mutate: updateRating,
    }));

    render(<Recipes />);

    const rating = screen.getByTestId('recipe-rating-1');
    const stars = within(rating).getAllByRole('radio');
    fireEvent.click(stars[4]);

    await waitFor(() => {
      expect(updateRating).toHaveBeenCalledWith({ id: 1, rating: 5 });
    });
  });
});
