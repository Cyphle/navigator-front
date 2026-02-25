import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { aPlannedMenuList, aPlannedMenuRecipe } from '../../../../test-utils/factories';
import { PlannedMenuListDetail } from './PlannedMenuListDetail';
import { useFetchRecipesPage } from '../../../stores/recipes/recipes.queries';

jest.mock('../../../stores/recipes/recipes.queries', () => ({
  useFetchRecipesPage: jest.fn(),
}));

const mockRecipesPage = {
  items: [
    { id: 1, name: 'Salade', category: 'ENTREE' as const, rating: 4 },
    { id: 2, name: 'Tarte', category: 'DESSERT' as const, rating: 5 },
  ],
  page: 1,
  pageSize: 10,
  total: 2,
};

describe('PlannedMenuListDetail', () => {
  beforeEach(() => {
    (useFetchRecipesPage as jest.Mock).mockReturnValue({
      data: mockRecipesPage,
      isPending: false,
      isError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays list information in header', () => {
    const list = aPlannedMenuList({
      name: 'Menu de test',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    expect(screen.getByText('Menu de test')).toBeInTheDocument();
    expect(screen.getByText('01/03/2026 - 07/03/2026')).toBeInTheDocument();
  });

  test('calls onBack when back button clicked', () => {
    const onBack = jest.fn();
    const list = aPlannedMenuList();

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={onBack}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /retour/i }));

    expect(onBack).toHaveBeenCalled();
  });

  test('shows empty state when no recipes selected', () => {
    const list = aPlannedMenuList({ recipes: [] });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    expect(screen.getByText('Aucune recette sélectionnée')).toBeInTheDocument();
  });

  test('displays selected recipes', () => {
    const list = aPlannedMenuList({
      recipes: [
        aPlannedMenuRecipe({ recipeId: 1, recipeName: 'Salade' }),
        aPlannedMenuRecipe({ recipeId: 2, recipeName: 'Tarte' }),
      ],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    expect(screen.getByText('Salade')).toBeInTheDocument();
    expect(screen.getByText('Tarte')).toBeInTheDocument();
  });

  test('calls onRemoveRecipe when remove button clicked', () => {
    const onRemoveRecipe = jest.fn();
    const list = aPlannedMenuList({
      recipes: [aPlannedMenuRecipe({ recipeId: 1, recipeName: 'Salade' })],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={onRemoveRecipe}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /retirer/i }));

    expect(onRemoveRecipe).toHaveBeenCalledWith(1);
  });

  test('opens add recipe modal when add button clicked', async () => {
    const list = aPlannedMenuList();

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Ajouter une recette')).toBeInTheDocument();
  });

  test('displays recipes in add modal', async () => {
    const list = aPlannedMenuList();

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('Salade')).toBeInTheDocument();
      expect(within(dialog).getByText('Tarte')).toBeInTheDocument();
    });
  });

  test('calls onAddRecipe and closes modal when recipe added', async () => {
    const onAddRecipe = jest.fn();
    const list = aPlannedMenuList();

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={onAddRecipe}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    const addButtons = within(dialog).getAllByRole('button', { name: /ajouter/i });

    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(onAddRecipe).toHaveBeenCalledWith(1, 'Salade', undefined);
    });
  });

  test('disables add button for already selected recipes', async () => {
    const list = aPlannedMenuList({
      recipes: [aPlannedMenuRecipe({ recipeId: 1, recipeName: 'Salade' })],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      const alreadyAddedButton = within(dialog).getByRole('button', { name: /déjà ajoutée/i });
      expect(alreadyAddedButton).toBeDisabled();
    });
  });

  test('opens days assignment modal when Jours button clicked', async () => {
    const list = aPlannedMenuList({
      recipes: [aPlannedMenuRecipe({ recipeId: 1, recipeName: 'Salade' })],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /jours/i }));

    await waitFor(() => {
      expect(screen.getByText(/Jours pour Salade/i)).toBeInTheDocument();
    });
  });

  test('shows assigned days for recipes', () => {
    const list = aPlannedMenuList({
      recipes: [
        aPlannedMenuRecipe({
          recipeId: 1,
          recipeName: 'Salade',
          assignedDays: ['2026-03-01', '2026-03-02'],
        }),
      ],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    expect(screen.getByText('01/03')).toBeInTheDocument();
    expect(screen.getByText('02/03')).toBeInTheDocument();
  });

  test('shows message when no days assigned', () => {
    const list = aPlannedMenuList({
      recipes: [aPlannedMenuRecipe({ recipeId: 1, recipeName: 'Salade', assignedDays: undefined })],
    });

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    expect(screen.getByText('Aucun jour assigné')).toBeInTheDocument();
  });

  test('shows loading state in modal when recipes are loading', async () => {
    (useFetchRecipesPage as jest.Mock).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });

    const list = aPlannedMenuList();

    render(
      <PlannedMenuListDetail
        list={list}
        onBack={jest.fn()}
        onAddRecipe={jest.fn()}
        onRemoveRecipe={jest.fn()}
        onUpdateRecipeDays={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    await waitFor(() => {
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });
  });
});
