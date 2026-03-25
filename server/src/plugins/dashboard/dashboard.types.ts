export type ItemVisibility = 'PERSONAL' | 'FAMILY';

export interface DashboardAgendaItem {
  id: number;
  title: string;
  time: string;
  person: string;
  calendarColor: string;
  visibility: ItemVisibility;
  attendees: string[];
}

export interface DashboardTodoItem {
  id: number;
  label: string;
  assignee: string;
  completed: boolean;
  visibility: ItemVisibility;
}

export interface DashboardMealsEntry {
  id: number;
  name: string;
  time: string;
  person: string;
  favorite: boolean;
  thumbnailColor: string;
  visibility: ItemVisibility;
}

export interface DashboardMealsDay {
  id: number;
  label: string;
  entries: DashboardMealsEntry[];
}

export interface DashboardMeals {
  weekLabel: string;
  days: DashboardMealsDay[];
}

export interface DashboardRecipe {
  id: number;
  name: string;
  favorite: boolean;
  selectedForWeek: boolean;
  visibility: ItemVisibility;
}

export interface DashboardShopping {
  items: number;
}

export interface Dashboard {
  agenda: DashboardAgendaItem[];
  todos: DashboardTodoItem[];
  weeklyMenu: DashboardMeals;
  recipes: DashboardRecipe[];
  shopping: DashboardShopping;
}
