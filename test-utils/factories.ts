import type { MealsList, MealsRecipe } from '../src/stores/meals/meals.types';
import type { ShoppingList, ShoppingListItem } from '../src/stores/shopping-lists/shopping-lists.types';
import type { Calendar, CalendarEvent } from '../src/stores/calendars/calendars.types';
import type { TodoList, TodoItem } from '../src/stores/family-todos/family-todos.types';
import type { Recipe } from '../src/stores/recipes/recipes.types';
import type { Family, FamilyMember } from '../src/stores/families/families.types';

export const aTodoItem = (overrides: Partial<TodoItem> = {}): TodoItem => ({
  id: overrides.id ?? 1,
  title: overrides.title ?? 'Faire les courses',
  description: overrides.description,
  dueDate: overrides.dueDate,
  status: overrides.status ?? 'TODO',
  createdAt: overrides.createdAt ?? '2026-03-01T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-03-01T10:00:00Z',
});

export const aTodoList = (overrides: Partial<TodoList> = {}): TodoList => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Tâches du foyer',
  type: overrides.type ?? 'PERSONAL',
  familyId: overrides.familyId,
  items: overrides.items ?? [],
  createdAt: overrides.createdAt ?? '2026-03-01T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-03-01T10:00:00Z',
});

export const aMealsRecipe = (
  overrides: Partial<MealsRecipe> = {}
): MealsRecipe => ({
  recipeId: overrides.recipeId ?? 1,
  recipeName: overrides.recipeName ?? 'Tarte aux pommes',
  assignedDays: overrides.assignedDays,
});

export const aMealsList = (
  overrides: Partial<MealsList> = {}
): MealsList => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Menu de la semaine',
  startDate: overrides.startDate ?? '2026-03-01',
  endDate: overrides.endDate ?? '2026-03-07',
  recipes: overrides.recipes ?? [],
  isActiveShoppingList: overrides.isActiveShoppingList ?? false,
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-02-25T10:00:00Z',
});

export const aShoppingListItem = (
  overrides: Partial<ShoppingListItem> = {}
): ShoppingListItem => ({
  id: overrides.id ?? 1,
  title: overrides.title ?? 'Pain',
  shop: overrides.shop,
  desireLevel: overrides.desireLevel,
  completed: overrides.completed ?? false,
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
});

export const aShoppingList = (
  overrides: Partial<ShoppingList> = {}
): ShoppingList => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Courses de la semaine',
  type: overrides.type ?? 'PERSONAL',
  familyId: overrides.familyId,
  items: overrides.items ?? [],
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-02-25T10:00:00Z',
});

export const aCalendarEvent = (
  overrides: Partial<CalendarEvent> = {}
): CalendarEvent => ({
  id: overrides.id ?? 1,
  calendarId: overrides.calendarId ?? 1,
  title: overrides.title ?? 'Réunion',
  description: overrides.description,
  invites: overrides.invites,
  date: overrides.date ?? '2026-03-01',
  time: overrides.time ?? '10:00',
  duration: overrides.duration ?? 60,
  recurrence: overrides.recurrence ?? 'NONE',
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-02-25T10:00:00Z',
});

export const aFamilyMember = (overrides: Partial<FamilyMember> = {}): FamilyMember => ({
  id: overrides.id ?? 1,
  email: overrides.email ?? 'member@test.com',
  role: overrides.role ?? 'Member',
  relation: overrides.relation,
});

export const aFamily = (overrides: Partial<Family> = {}): Family => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Famille Martin',
  owner: overrides.owner ?? { id: 1, email: 'owner@test.com', role: 'Owner' },
  members: overrides.members ?? [],
  status: overrides.status ?? 'ACTIVE',
});

export const aRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Tarte aux pommes',
  category: overrides.category ?? 'DESSERT',
  rating: overrides.rating ?? 4,
  imageUrl: overrides.imageUrl,
  ingredients: overrides.ingredients ?? ['Pommes', 'Pâte feuilletée'],
  steps: overrides.steps ?? ['Éplucher les pommes', 'Étaler la pâte'],
  parts: overrides.parts,
});

export const aCalendar = (
  overrides: Partial<Calendar> = {}
): Calendar => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Mon calendrier',
  color: overrides.color ?? '#1890ff',
  type: overrides.type ?? 'PERSONAL',
  familyId: overrides.familyId,
  events: overrides.events ?? [],
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-02-25T10:00:00Z',
});
