import { fireEvent, screen, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { RecipeList } from './RecipeList';

describe('RecipeList', () => {
  test('renders recipes and handles actions', () => {
    const onSelect = jest.fn();
    const onEdit = jest.fn();
    const onShare = jest.fn();
    const onDelete = jest.fn();
    const onRate = jest.fn();

    render(
      <RecipeList
        recipes={[
          { id: 1, name: 'Salade', category: 'ENTREE', rating: 4 },
          { id: 2, name: 'Tarte', category: 'DESSERT', rating: 5, imageUrl: 'https://example.com/tarte.jpg' },
        ]}
        categoryLabels={{ ENTREE: 'Entrée', PLAT: 'Plat', DESSERT: 'Dessert', SAUCE: 'Sauce', APERO: 'Apéro' }}
        onSelect={onSelect}
        onEdit={onEdit}
        onShare={onShare}
        onDelete={onDelete}
        onRate={onRate}
      />
    );

    fireEvent.click(screen.getByText('Salade'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

    fireEvent.click(screen.getAllByRole('button', { name: /modifier/i })[0]);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

    fireEvent.click(screen.getAllByRole('button', { name: /partager/i })[0]);
    expect(onShare).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

    fireEvent.click(screen.getAllByRole('button', { name: /supprimer/i })[0]);
    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

    const rating = screen.getByTestId('recipe-rating-1');
    const stars = within(rating).getAllByRole('radio');
    fireEvent.click(stars[4]);
    expect(onRate).toHaveBeenCalledWith(1, 5);

    expect(screen.getAllByTestId('default-recipe-icon')).toHaveLength(1);
  });
});
