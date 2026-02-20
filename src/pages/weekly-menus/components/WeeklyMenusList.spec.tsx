import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { WeeklyMenusList } from './WeeklyMenusList';

describe('WeeklyMenusList', () => {
  test('renders recipes and triggers select', () => {
    const onSelect = jest.fn();
    render(
      <WeeklyMenusList
        recipes={[
          { id: 1, name: 'Salade', category: 'ENTREE', rating: 4 },
          { id: 2, name: 'Tarte', category: 'DESSERT', rating: 5 },
        ]}
        categoryLabels={{ ENTREE: 'Entrée', PLAT: 'Plat', DESSERT: 'Dessert', SAUCE: 'Sauce', APERO: 'Apéro' }}
        selectedIds={new Set()}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText('Salade')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /ajouter/i })[0]);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  test('disables button when already selected', () => {
    render(
      <WeeklyMenusList
        recipes={[
          { id: 1, name: 'Salade', category: 'ENTREE', rating: 4 },
        ]}
        categoryLabels={{ ENTREE: 'Entrée', PLAT: 'Plat', DESSERT: 'Dessert', SAUCE: 'Sauce', APERO: 'Apéro' }}
        selectedIds={new Set([1])}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /ajoutée/i })).toBeDisabled();
  });
});
