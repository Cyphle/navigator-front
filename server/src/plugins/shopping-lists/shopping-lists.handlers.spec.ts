import {
  getAllShoppingLists,
  getShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addItemToShoppingList,
  updateItemInShoppingList,
  deleteItemFromShoppingList,
} from './shopping-lists.handlers';

describe('shopping-lists handlers', () => {
  test('should create shopping list', () => {
    const input = {
      name: 'Courses',
      type: 'PERSONAL' as const,
    };

    const created = createShoppingList(input);

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe('Courses');
    expect(created.type).toBe('PERSONAL');
    expect(created.items).toEqual([]);
  });

  test('should get all shopping lists', () => {
    const list1 = createShoppingList({ name: 'Liste 1', type: 'PERSONAL' });
    const list2 = createShoppingList({ name: 'Liste 2', type: 'SHARED', familyId: 5 });

    const lists = getAllShoppingLists();

    expect(lists.length).toBeGreaterThanOrEqual(2);
    expect(lists.some((l) => l.name === 'Liste 1')).toBe(true);
    expect(lists.some((l) => l.name === 'Liste 2')).toBe(true);
  });

  test('should get shopping list by id', () => {
    const created = createShoppingList({ name: 'Test', type: 'PERSONAL' });

    const found = getShoppingListById(created.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Test');
  });

  test('should return undefined for non-existent id', () => {
    const found = getShoppingListById(99999);

    expect(found).toBeUndefined();
  });

  test('should update shopping list', () => {
    const created = createShoppingList({ name: 'Original', type: 'PERSONAL' });

    const updated = updateShoppingList(created.id, { name: 'Updated' });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Updated');
  });

  test('should delete shopping list', () => {
    const created = createShoppingList({ name: 'To Delete', type: 'PERSONAL' });

    const deleted = deleteShoppingList(created.id);

    expect(deleted).toBe(true);
    expect(getShoppingListById(created.id)).toBeUndefined();
  });

  test('should add item to shopping list', () => {
    const list = createShoppingList({ name: 'Courses', type: 'PERSONAL' });

    const updated = addItemToShoppingList(list.id, {
      title: 'Pain',
      shop: 'Intermarché',
      desireLevel: 'REALLY_WANT',
    });

    expect(updated).toBeDefined();
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].title).toBe('Pain');
    expect(updated?.items[0].shop).toBe('Intermarché');
    expect(updated?.items[0].desireLevel).toBe('REALLY_WANT');
    expect(updated?.items[0].completed).toBe(false);
  });

  test('should update item in shopping list', () => {
    const list = createShoppingList({ name: 'Courses', type: 'PERSONAL' });
    const withItem = addItemToShoppingList(list.id, { title: 'Lait' });
    const itemId = withItem?.items[0].id!;

    const updated = updateItemInShoppingList(list.id, itemId, { completed: true });

    expect(updated).toBeDefined();
    expect(updated?.items[0].completed).toBe(true);
  });

  test('should delete item from shopping list', () => {
    const list = createShoppingList({ name: 'Courses', type: 'PERSONAL' });
    const withItem = addItemToShoppingList(list.id, { title: 'Pain' });
    const itemId = withItem?.items[0].id!;

    const updated = deleteItemFromShoppingList(list.id, itemId);

    expect(updated).toBeDefined();
    expect(updated?.items).toHaveLength(0);
  });

  test('should return undefined when adding item to non-existent list', () => {
    const updated = addItemToShoppingList(99999, { title: 'Test' });

    expect(updated).toBeUndefined();
  });

  test('should return undefined when updating non-existent item', () => {
    const list = createShoppingList({ name: 'Courses', type: 'PERSONAL' });

    const updated = updateItemInShoppingList(list.id, 99999, { completed: true });

    expect(updated).toBeUndefined();
  });

  test('should handle deleting non-existent item', () => {
    const list = createShoppingList({ name: 'Courses', type: 'PERSONAL' });

    const updated = deleteItemFromShoppingList(list.id, 99999);

    expect(updated).toBeDefined();
    expect(updated?.items).toHaveLength(0);
  });
});
