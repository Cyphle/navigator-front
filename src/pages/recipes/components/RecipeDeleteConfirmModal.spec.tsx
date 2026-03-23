import { render, screen } from '../../../../test-utils';
import { RecipeDeleteConfirmModal } from './RecipeDeleteConfirmModal';
import { fireEvent } from '@testing-library/react';
import type { Recipe } from '../../../stores/recipes/recipes.types';

const aRecipe = (): Recipe => ({
  id: 1,
  name: 'Tarte aux pommes',
  category: 'DESSERT',
  rating: 4,
});

describe('RecipeDeleteConfirmModal', () => {
  test('does not render when recipe is null', () => {
    render(
      <RecipeDeleteConfirmModal recipe={null} isLoading={false} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('shows recipe name in confirmation message', () => {
    render(
      <RecipeDeleteConfirmModal recipe={aRecipe()} isLoading={false} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.getByText('Tarte aux pommes')).toBeInTheDocument();
  });

  test('Confirmer button calls onConfirm with the recipe', () => {
    const onConfirm = jest.fn();
    const recipe = aRecipe();

    render(
      <RecipeDeleteConfirmModal recipe={recipe} isLoading={false} onConfirm={onConfirm} onCancel={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: /confirmer/i }));

    expect(onConfirm).toHaveBeenCalledWith(recipe);
  });

  test('Annuler button calls onCancel', () => {
    const onCancel = jest.fn();

    render(
      <RecipeDeleteConfirmModal recipe={aRecipe()} isLoading={false} onConfirm={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('Confirmer is disabled and shows loading text when isLoading', () => {
    render(
      <RecipeDeleteConfirmModal recipe={aRecipe()} isLoading={true} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.getByRole('button', { name: /suppression/i })).toBeDisabled();
  });
});
