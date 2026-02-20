import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { WeeklyMenusSelected } from './WeeklyMenusSelected';

describe('WeeklyMenusSelected', () => {
  test('renders empty state', () => {
    render(<WeeklyMenusSelected selectedRecipes={[]} onRemove={jest.fn()} />);
    expect(screen.getByText('Aucune recette sélectionnée.')).toBeInTheDocument();
  });

  test('renders selected recipes and removes', () => {
    const onRemove = jest.fn();
    render(
      <WeeklyMenusSelected
        selectedRecipes={[{ id: 1, name: 'Salade', category: 'ENTREE', rating: 4 }]}
        onRemove={onRemove}
      />
    );

    expect(screen.getByText('Salade')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /retirer/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
