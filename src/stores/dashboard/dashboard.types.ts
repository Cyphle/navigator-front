export type ItemVisibility = 'PERSONAL' | 'FAMILY';

export interface DashboardAgendaItem {
  id: number;
  title: string;
  time: string;
  person: string;
  accentColor: string;
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

export interface DashboardMenuEntry {
  id: number;
  name: string;
  time: string;
  person: string;
  favorite: boolean;
  thumbnailColor: string;
  visibility: ItemVisibility;
}

export interface DashboardMenuDay {
  id: number;
  label: string;
  entries: DashboardMenuEntry[];
}

export interface DashboardWeeklyMenu {
  weekLabel: string;
  days: DashboardMenuDay[];
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

export interface DashboardData {
  agenda: DashboardAgendaItem[];
  todos: DashboardTodoItem[];
  weeklyMenu: DashboardWeeklyMenu;
  recipes: DashboardRecipe[];
  shopping: DashboardShopping;
}
