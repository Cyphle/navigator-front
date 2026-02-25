import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils/render';
import { aShoppingList } from '../../../test-utils/factories';
import * as shoppingListsService from '../../services/shopping-lists.service';
import { ShoppingLists } from './ShoppingLists';

jest.mock('../../services/shopping-lists.service', () => ({
  getAllShoppingLists: jest.fn(),
  getShoppingListById: jest.fn(),
  createShoppingList: jest.fn(),
  deleteShoppingList: jest.fn(),
  addItemToShoppingList: jest.fn(),
  updateItemInShoppingList: jest.fn(),
  deleteItemFromShoppingList: jest.fn(),
}));

describe('ShoppingLists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state', () => {
    jest.mocked(shoppingListsService.getAllShoppingLists).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ShoppingLists />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows error state', async () => {
    jest
      .mocked(shoppingListsService.getAllShoppingLists)
      .mockRejectedValue(new Error('Network error'));

    render(<ShoppingLists />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders shopping lists view by default', async () => {
    const mockLists = [aShoppingList({ id: 1, name: 'Courses' })];
    jest.mocked(shoppingListsService.getAllShoppingLists).mockResolvedValue(mockLists);

    render(<ShoppingLists />);

    await waitFor(() => {
      expect(screen.getByText('Courses')).toBeInTheDocument();
    });
  });

  test('shows empty state when no lists', async () => {
    jest.mocked(shoppingListsService.getAllShoppingLists).mockResolvedValue([]);

    render(<ShoppingLists />);

    await waitFor(() => {
      expect(screen.getByText('Aucune liste de courses')).toBeInTheDocument();
    });
  });
});
