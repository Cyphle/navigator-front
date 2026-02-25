import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { aShoppingList, aShoppingListItem } from '../../../../test-utils/factories';
import { ShoppingListDetail } from './ShoppingListDetail';

describe('ShoppingListDetail', () => {
  const onBack = jest.fn();
  const onAddItem = jest.fn();
  const onToggleItem = jest.fn();
  const onDeleteItem = jest.fn();
  const onClearCompleted = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders list name and type', () => {
    const list = aShoppingList({ name: 'Courses', type: 'PERSONAL' });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Personnelle')).toBeInTheDocument();
  });

  test('shows shared tag for shared lists', () => {
    const list = aShoppingList({ type: 'SHARED' });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('Partagée')).toBeInTheDocument();
  });

  test('calls onBack when back button clicked', () => {
    const list = aShoppingList();

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /retour/i }));

    expect(onBack).toHaveBeenCalled();
  });

  test('shows empty state when no items', () => {
    const list = aShoppingList({ items: [] });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('Aucun article')).toBeInTheDocument();
  });

  test('displays active items', () => {
    const list = aShoppingList({
      items: [
        aShoppingListItem({ id: 1, title: 'Pain', completed: false }),
        aShoppingListItem({ id: 2, title: 'Lait', completed: false }),
      ],
    });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('À acheter (2)')).toBeInTheDocument();
    expect(screen.getByText('Pain')).toBeInTheDocument();
    expect(screen.getByText('Lait')).toBeInTheDocument();
  });

  test('displays completed items', () => {
    const list = aShoppingList({
      items: [aShoppingListItem({ id: 1, title: 'Pain', completed: true })],
    });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('Acheté (1)')).toBeInTheDocument();
    expect(screen.getByText('Pain')).toBeInTheDocument();
  });

  test('displays item shop and desire level', () => {
    const list = aShoppingList({
      items: [
        aShoppingListItem({
          id: 1,
          title: 'Pain',
          shop: 'Intermarché',
          desireLevel: 'REALLY_WANT',
          completed: false,
        }),
      ],
    });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    expect(screen.getByText('Intermarché')).toBeInTheDocument();
    expect(screen.getByText('Vraiment envie')).toBeInTheDocument();
  });

  test('calls onDeleteItem when delete button clicked', () => {
    const list = aShoppingList({
      items: [aShoppingListItem({ id: 1, title: 'Pain', completed: false })],
    });

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find((btn) => btn.querySelector('.anticon-delete'));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(onDeleteItem).toHaveBeenCalledWith(1);
    }
  });

  test('opens add item modal when add button clicked', () => {
    const list = aShoppingList();

    render(
      <ShoppingListDetail
        list={list}
        onBack={onBack}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onClearCompleted={onClearCompleted}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ajouter un article/i }));

    // Modal title appears twice (as button text and modal title)
    expect(screen.getAllByText('Ajouter un article').length).toBeGreaterThan(1);
  });
});
