import { render, screen } from '../../../../test-utils';
import { RecipeShareModal } from './RecipeShareModal';
import { fireEvent } from '@testing-library/react';
import type { Recipe } from '../../../stores/recipes/recipes.types';

const aRecipe = (): Recipe => ({ id: 1, name: 'Quiche lorraine', category: 'PLAT', rating: 5 });

describe('RecipeShareModal', () => {
  test('does not render when recipe is null', () => {
    render(<RecipeShareModal recipe={null} onClose={jest.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('shows recipe name', () => {
    render(<RecipeShareModal recipe={aRecipe()} onClose={jest.fn()} />);

    expect(screen.getByText('Quiche lorraine')).toBeInTheDocument();
  });

  test('Fermer button calls onClose', () => {
    const onClose = jest.fn();

    render(<RecipeShareModal recipe={aRecipe()} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: /fermer/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
