import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { aShoppingList, aShoppingListItem } from '../../../../test-utils/factories';
import { ShoppingListsView } from './ShoppingListsView';

describe('ShoppingListsView', () => {
  test('shows empty state when no lists', () => {
    render(
      <ShoppingListsView
        lists={[]}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Aucune liste de courses')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer ma première liste/i })).toBeInTheDocument();
  });

  test('calls onCreateNew when create button clicked in empty state', () => {
    const onCreateNew = jest.fn();

    render(
      <ShoppingListsView
        lists={[]}
        onCreateNew={onCreateNew}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /créer ma première liste/i }));

    expect(onCreateNew).toHaveBeenCalled();
  });

  test('displays shopping lists', () => {
    const lists = [
      aShoppingList({ id: 1, name: 'Liste 1', type: 'PERSONAL' }),
      aShoppingList({ id: 2, name: 'Liste 2', type: 'SHARED' }),
    ];

    render(
      <ShoppingListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Liste 1')).toBeInTheDocument();
    expect(screen.getByText('Liste 2')).toBeInTheDocument();
    expect(screen.getByText('Personnelle')).toBeInTheDocument();
    expect(screen.getByText('Partagée')).toBeInTheDocument();
  });

  test('shows item counts', () => {
    const lists = [
      aShoppingList({
        id: 1,
        name: 'Courses',
        items: [
          aShoppingListItem({ id: 1, completed: true }),
          aShoppingListItem({ id: 2, completed: false }),
          aShoppingListItem({ id: 3, completed: false }),
        ],
      }),
    ];

    render(
      <ShoppingListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('1 / 3 articles')).toBeInTheDocument();
  });

  test('calls onSelectList when card clicked', () => {
    const onSelectList = jest.fn();
    const lists = [aShoppingList({ id: 1, name: 'Test' })];

    render(
      <ShoppingListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={onSelectList}
        onDelete={jest.fn()}
      />
    );

    const card = screen.getByText('Test').closest('.ant-card');
    if (card) {
      fireEvent.click(card);
      expect(onSelectList).toHaveBeenCalledWith(1);
    }
  });

  test('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    const lists = [aShoppingList({ id: 1 })];

    render(
      <ShoppingListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={jest.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('stops propagation when delete button clicked', () => {
    const onSelectList = jest.fn();
    const onDelete = jest.fn();
    const lists = [aShoppingList({ id: 1 })];

    render(
      <ShoppingListsView
        lists={lists}
        onCreateNew={jest.fn()}
        onSelectList={onSelectList}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onSelectList).not.toHaveBeenCalled();
  });
});
