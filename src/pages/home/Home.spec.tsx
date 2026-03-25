import { renderWithRouter, screen } from '../../../test-utils';
import { Home } from './Home.tsx';

jest.mock('../../stores/calendars/calendars.queries.ts', () => ({
  useFetchCalendarSummary: jest.fn(() => ({ data: [], isPending: false, isError: false })),
}));
jest.mock('../../stores/family-todos/family-todos.queries.ts', () => ({
  useFetchTodosSummary: jest.fn(() => ({ data: [], isPending: false, isError: false })),
}));
jest.mock('../../stores/recipes/recipes.queries.ts', () => ({
  useFetchRecipesSummary: jest.fn(() => ({ data: [], isPending: false, isError: false })),
}));
jest.mock('../../stores/shopping-lists/shopping-lists.queries.ts', () => ({
  useFetchShoppingListSummary: jest.fn(() => ({ data: { items: 0 }, isPending: false, isError: false })),
}));
jest.mock('../../stores/meals/meals.queries.ts', () => ({
  useFetchMealsSummary: jest.fn(() => ({
    data: { weekLabel: '', days: [] },
    isPending: false,
    isError: false,
  })),
}));
jest.mock('../../stores/bank-accounts/bank-accounts.queries.ts', () => ({
  useFetchBankAccountsSummary: jest.fn(() => ({ data: [], isPending: false, isError: false })),
}));

describe('Home', () => {
  test('renders the agenda section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Agenda familial')).toBeInTheDocument();
  });

  test('renders the todos section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Todos familiaux')).toBeInTheDocument();
  });

  test('renders the bank accounts section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Comptes bancaires')).toBeInTheDocument();
  });

  test('renders stat cards', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('événements à venir')).toBeInTheDocument();
    expect(screen.getByText('articles à acheter')).toBeInTheDocument();
  });
});
