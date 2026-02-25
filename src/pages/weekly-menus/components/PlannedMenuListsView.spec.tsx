import { fireEvent, screen, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { aPlannedMenuList, aPlannedMenuRecipe } from '../../../../test-utils/factories';
import { PlannedMenuListsView } from './PlannedMenuListsView';

describe('PlannedMenuListsView', () => {
  test('shows empty state when no lists', () => {
    render(
      <PlannedMenuListsView
        lists={[]}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    expect(screen.getByText('Aucune liste de menus planifiés')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer ma première liste/i })).toBeInTheDocument();
  });

  test('calls onCreateNew when create button clicked in empty state', () => {
    const onCreateNew = jest.fn();

    render(
      <PlannedMenuListsView
        lists={[]}
        onCreateNew={onCreateNew}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /créer ma première liste/i }));

    expect(onCreateNew).toHaveBeenCalled();
  });

  test('displays header with create button when lists exist', () => {
    const lists = [aPlannedMenuList()];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    expect(screen.getByText('Mes listes de menus planifiés')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nouvelle liste/i })).toBeInTheDocument();
  });

  test('calls onCreateNew when create button clicked in header', () => {
    const onCreateNew = jest.fn();
    const lists = [aPlannedMenuList()];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={onCreateNew}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /nouvelle liste/i }));

    expect(onCreateNew).toHaveBeenCalled();
  });

  test('renders list cards with correct information', () => {
    const lists = [
      aPlannedMenuList({
        id: 1,
        name: 'Menu semaine 1',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        recipes: [aPlannedMenuRecipe(), aPlannedMenuRecipe({ recipeId: 2 })],
        isActiveShoppingList: false,
      }),
    ];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    expect(screen.getByText('Menu semaine 1')).toBeInTheDocument();
    expect(screen.getByText(/01\/03\/2026 - 07\/03\/2026/)).toBeInTheDocument();
    expect(screen.getByText('6 jours')).toBeInTheDocument();
    expect(screen.getByText('2 recettes')).toBeInTheDocument();
  });

  test('calls onSelectList when card is clicked', () => {
    const onSelectList = jest.fn();
    const lists = [aPlannedMenuList({ id: 1, name: 'Menu test' })];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={onSelectList}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    const card = screen.getByText('Menu test').closest('.ant-card');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.click(card);
      expect(onSelectList).toHaveBeenCalledWith(1);
    }
  });

  test('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    const lists = [aPlannedMenuList({ id: 1 })];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={onDelete}
        onToggleShoppingList={jest.fn()}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('calls onToggleShoppingList when shopping button clicked', () => {
    const onToggleShoppingList = jest.fn();
    const lists = [aPlannedMenuList({ id: 1, isActiveShoppingList: false })];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={onToggleShoppingList}
      />
    );

    const activateButton = screen.getByRole('button', { name: /activer/i });
    fireEvent.click(activateButton);

    expect(onToggleShoppingList).toHaveBeenCalledWith(1, true);
  });

  test('shows active shopping list badge when enabled', () => {
    const lists = [aPlannedMenuList({ id: 1, isActiveShoppingList: true })];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    expect(screen.getByText('Liste de courses active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /liste active/i })).toBeInTheDocument();
  });

  test('stops event propagation when action buttons clicked', () => {
    const onSelectList = jest.fn();
    const onDelete = jest.fn();
    const lists = [aPlannedMenuList({ id: 1 })];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={onSelectList}
        onDelete={onDelete}
        onToggleShoppingList={jest.fn()}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    // onSelectList should not be called when clicking delete
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onSelectList).not.toHaveBeenCalled();
  });

  test('renders multiple lists correctly', () => {
    const lists = [
      aPlannedMenuList({ id: 1, name: 'Menu 1' }),
      aPlannedMenuList({ id: 2, name: 'Menu 2' }),
      aPlannedMenuList({ id: 3, name: 'Menu 3' }),
    ];

    render(
      <PlannedMenuListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
        onToggleShoppingList={jest.fn()}
      />
    );

    expect(screen.getByText('Menu 1')).toBeInTheDocument();
    expect(screen.getByText('Menu 2')).toBeInTheDocument();
    expect(screen.getByText('Menu 3')).toBeInTheDocument();
  });
});
