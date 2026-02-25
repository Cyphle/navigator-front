import {
  getAllPlannedMenuLists,
  getPlannedMenuListById,
  createPlannedMenuList,
  updatePlannedMenuList,
  deletePlannedMenuList,
  addRecipeToPlannedMenuList,
  removeRecipeFromPlannedMenuList,
} from './planned-menus.handlers';

describe('planned-menus handlers', () => {
  test('should get all planned menu lists', () => {
    const list1 = createPlannedMenuList({
      name: 'Menu 1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const list2 = createPlannedMenuList({
      name: 'Menu 2',
      startDate: '2026-03-08',
      endDate: '2026-03-14',
    });

    const lists = getAllPlannedMenuLists();

    expect(lists).toHaveLength(2);
    expect(lists[0].name).toBe('Menu 1');
    expect(lists[1].name).toBe('Menu 2');
  });

  test('should get planned menu list by id', () => {
    const created = createPlannedMenuList({
      name: 'Test Menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const found = getPlannedMenuListById(created.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Test Menu');
  });

  test('should return undefined for non-existent id', () => {
    const found = getPlannedMenuListById(99999);

    expect(found).toBeUndefined();
  });

  test('should create planned menu list with correct fields', () => {
    const input = {
      name: 'New Menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    };

    const created = createPlannedMenuList(input);

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe('New Menu');
    expect(created.startDate).toBe('2026-03-01');
    expect(created.endDate).toBe('2026-03-07');
    expect(created.recipes).toEqual([]);
    expect(created.isActiveShoppingList).toBe(false);
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();
  });

  test('should update planned menu list', () => {
    const created = createPlannedMenuList({
      name: 'Original Name',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const updated = updatePlannedMenuList(created.id, {
      name: 'Updated Name',
      isActiveShoppingList: true,
    });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.isActiveShoppingList).toBe(true);
    expect(updated?.startDate).toBe('2026-03-01');
  });

  test('should return undefined when updating non-existent list', () => {
    const updated = updatePlannedMenuList(99999, { name: 'Test' });

    expect(updated).toBeUndefined();
  });

  test('should delete planned menu list', () => {
    const created = createPlannedMenuList({
      name: 'To Delete',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const deleted = deletePlannedMenuList(created.id);

    expect(deleted).toBe(true);
    expect(getPlannedMenuListById(created.id)).toBeUndefined();
  });

  test('should return false when deleting non-existent list', () => {
    const deleted = deletePlannedMenuList(99999);

    expect(deleted).toBe(false);
  });

  test('should add recipe to planned menu list', () => {
    const created = createPlannedMenuList({
      name: 'Menu with recipes',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const updated = addRecipeToPlannedMenuList(created.id, 5, 'Tarte aux pommes', ['2026-03-02']);

    expect(updated).toBeDefined();
    expect(updated?.recipes).toHaveLength(1);
    expect(updated?.recipes[0].recipeId).toBe(5);
    expect(updated?.recipes[0].recipeName).toBe('Tarte aux pommes');
    expect(updated?.recipes[0].assignedDays).toEqual(['2026-03-02']);
  });

  test('should update existing recipe when adding duplicate', () => {
    const created = createPlannedMenuList({
      name: 'Menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    addRecipeToPlannedMenuList(created.id, 5, 'Tarte', ['2026-03-02']);
    const updated = addRecipeToPlannedMenuList(created.id, 5, 'Tarte', ['2026-03-03', '2026-03-04']);

    expect(updated?.recipes).toHaveLength(1);
    expect(updated?.recipes[0].assignedDays).toEqual(['2026-03-03', '2026-03-04']);
  });

  test('should return undefined when adding recipe to non-existent list', () => {
    const updated = addRecipeToPlannedMenuList(99999, 5, 'Tarte');

    expect(updated).toBeUndefined();
  });

  test('should remove recipe from planned menu list', () => {
    const created = createPlannedMenuList({
      name: 'Menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    addRecipeToPlannedMenuList(created.id, 5, 'Tarte');
    addRecipeToPlannedMenuList(created.id, 6, 'Salade');

    const updated = removeRecipeFromPlannedMenuList(created.id, 5);

    expect(updated).toBeDefined();
    expect(updated?.recipes).toHaveLength(1);
    expect(updated?.recipes[0].recipeId).toBe(6);
  });

  test('should return undefined when removing recipe from non-existent list', () => {
    const updated = removeRecipeFromPlannedMenuList(99999, 5);

    expect(updated).toBeUndefined();
  });

  test('should handle removing non-existent recipe', () => {
    const created = createPlannedMenuList({
      name: 'Menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    const updated = removeRecipeFromPlannedMenuList(created.id, 99999);

    expect(updated).toBeDefined();
    expect(updated?.recipes).toHaveLength(0);
  });
});
