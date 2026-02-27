import type { PlannedMenuList, PlannedMenuRecipe } from '../src/stores/planned-menus/planned-menus.types';
import type { ShoppingList, ShoppingListItem } from '../src/stores/shopping-lists/shopping-lists.types';
import type { Calendar, CalendarEvent } from '../src/stores/calendars/calendars.types';

export const aPlannedMenuRecipe = (
  overrides: Partial<PlannedMenuRecipe> = {}
): PlannedMenuRecipe => ({
  recipeId: overrides.recipeId ?? 1,
  recipeName: overrides.recipeName ?? 'Tarte aux pommes',
  assignedDays: overrides.assignedDays,
});

export const aPlannedMenuList = (
  overrides: Partial<PlannedMenuList> = {}
): PlannedMenuList => ({
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
