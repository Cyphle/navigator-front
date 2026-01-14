import { getOne } from '../helpers/http.ts';
import {
  DashboardAgendaItem,
  DashboardData,
  DashboardMenuDay,
  DashboardMenuEntry,
  DashboardRecipe,
  DashboardTodoItem
} from '../stores/dashboard/dashboard.types.ts';

export const getDashboard = (): Promise<DashboardData> => {
  return getOne('dashboard', responseToDashboard);
}

export const responseToDashboard = (data: any): DashboardData => {
  return {
    agenda: data.agenda.map((item: any) => toAgendaItem(item)),
    todos: data.todos.map((item: any) => toTodoItem(item)),
    weeklyMenu: {
      weekLabel: data.weeklyMenu.weekLabel,
      days: data.weeklyMenu.days.map((day: any) => toMenuDay(day))
    },
    recipes: data.recipes.map((recipe: any) => toRecipe(recipe)),
    shopping: {
      items: data.shopping.items
    }
  };
}

const toAgendaItem = (item: any): DashboardAgendaItem => ({
  id: item.id,
  title: item.title,
  time: item.time,
  person: item.person,
  accentColor: item.accentColor,
  visibility: item.visibility,
  attendees: item.attendees
});

const toTodoItem = (item: any): DashboardTodoItem => ({
  id: item.id,
  label: item.label,
  assignee: item.assignee,
  completed: item.completed,
  visibility: item.visibility
});

const toMenuEntry = (entry: any): DashboardMenuEntry => ({
  id: entry.id,
  name: entry.name,
  time: entry.time,
  person: entry.person,
  favorite: entry.favorite,
  thumbnailColor: entry.thumbnailColor,
  visibility: entry.visibility
});

const toMenuDay = (day: any): DashboardMenuDay => ({
  id: day.id,
  label: day.label,
  entries: day.entries.map((entry: any) => toMenuEntry(entry))
});

const toRecipe = (recipe: any): DashboardRecipe => ({
  id: recipe.id,
  name: recipe.name,
  favorite: recipe.favorite,
  selectedForWeek: recipe.selectedForWeek,
  visibility: recipe.visibility
});
