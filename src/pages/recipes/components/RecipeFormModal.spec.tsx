import { screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { RecipeFormModal } from './RecipeFormModal';

describe('RecipeFormModal', () => {
  test('renders create mode', () => {
    render(<RecipeFormModal open mode="create" onCancel={jest.fn()} />);

    expect(screen.getByText('Créer une recette')).toBeInTheDocument();
    expect(screen.getByText('Le formulaire de création sera disponible prochainement.')).toBeInTheDocument();
  });

  test('renders edit mode with recipe name', () => {
    render(
      <RecipeFormModal
        open
        mode="edit"
        recipe={{ id: 1, name: 'Salade', category: 'ENTREE', rating: 4 }}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Mettre à jour la recette')).toBeInTheDocument();
    expect(screen.getByText('La mise à jour de Salade sera disponible prochainement.')).toBeInTheDocument();
  });
});
