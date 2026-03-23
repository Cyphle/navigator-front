import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { RecipeDetailModal } from './RecipeDetailModal';
import { aRecipe } from '../../../../test-utils/factories';
import type { RecipeCategory } from '../../../stores/recipes/recipes.types';

const categoryLabels: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

describe('RecipeDetailModal', () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when recipe is null', () => {
    render(<RecipeDetailModal recipe={null} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders recipe name and category', () => {
    const recipe = aRecipe({ name: 'Quiche lorraine', category: 'PLAT' });

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.getByText('Quiche lorraine')).toBeInTheDocument();
    expect(screen.getByText('Plat')).toBeInTheDocument();
  });

  test('renders ingredients and steps', () => {
    const recipe = aRecipe({
      ingredients: ['Lardons', 'Crème fraîche', 'Œufs'],
      steps: ['Mélanger les ingrédients', 'Cuire 30 minutes'],
    });

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.getByText('Lardons')).toBeInTheDocument();
    expect(screen.getByText('Crème fraîche')).toBeInTheDocument();
    expect(screen.getByText('Mélanger les ingrédients')).toBeInTheDocument();
  });

  test('renders multi-part recipe', () => {
    const recipe = aRecipe({
      ingredients: undefined,
      steps: undefined,
      parts: [
        {
          name: 'Pâte',
          ingredients: ['Farine', 'Beurre'],
          steps: ['Mélanger farine et beurre'],
        },
        {
          name: 'Garniture',
          ingredients: ['Pommes'],
          steps: ['Éplucher les pommes'],
        },
      ],
    });

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.getByText('Pâte')).toBeInTheDocument();
    expect(screen.getByText('Garniture')).toBeInTheDocument();
    expect(screen.getByText('Farine')).toBeInTheDocument();
  });

  test('shows "Aucun détail disponible" when recipe has no ingredients or parts', () => {
    const recipe = aRecipe({ ingredients: [], steps: [], parts: [] });

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.getByText('Aucun détail disponible')).toBeInTheDocument();
  });

  test('shows recipe rating', () => {
    const recipe = aRecipe({ rating: 3 });

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  test('calls onClose when dialog is closed', () => {
    const recipe = aRecipe();

    render(<RecipeDetailModal recipe={recipe} categoryLabels={categoryLabels} onClose={onClose} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});
