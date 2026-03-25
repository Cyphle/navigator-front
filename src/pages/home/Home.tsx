import { useFamily } from '../../contexts/family/family.context.tsx';
import { Calendar, CheckSquare, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { StatCard, type StatCardData } from './components/StatCard.tsx';
import { AgendaSection } from './components/AgendaSection.tsx';
import { TodosSection } from './components/TodosSection.tsx';
import { MealsSection } from './components/MealsSection.tsx';
import NoFamilyOverlay from '@/pages/home/components/NoFamilyOverlay.tsx';
import { useFetchCalendarSummary } from '@/stores/calendars/calendars.queries.ts';
import { useFetchTodosSummary } from '@/stores/family-todos/family-todos.queries.ts';
import { useFetchRecipesSummary } from '@/stores/recipes/recipes.queries.ts';
import { useFetchShoppingListSummary } from '@/stores/shopping-lists/shopping-lists.queries.ts';
import { useFetchMealsSummary } from '@/stores/meals/meals.queries.ts';
import { useFetchBankAccountsSummary } from '@/stores/bank-accounts/bank-accounts.queries.ts';
import { BankAccountsSection } from './components/BankAccountsSection.tsx';

const buildStatCards = (
  agendaCount: number,
  activeTodosCount: number,
  favoriteRecipesCount: number,
  shoppingItems: number
): StatCardData[] => [
  {
    title: 'Familles actives',
    value: agendaCount,
    subtitle: 'événements à venir',
    icon: <Calendar className="w-5 h-5" />,
    iconColor: 'var(--ocean)',
    iconBg: 'var(--ocean-pale)',
  },
  {
    title: 'Tâches en cours',
    value: activeTodosCount,
    subtitle: 'tâches actives',
    icon: <CheckSquare className="w-5 h-5" />,
    iconColor: 'var(--sage)',
    iconBg: 'var(--sage-pale)',
  },
  {
    title: 'Recettes',
    value: favoriteRecipesCount,
    subtitle: 'recettes favorites',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    iconColor: 'var(--sun)',
    iconBg: 'var(--sun-pale)',
  },
  {
    title: 'Liste de courses',
    value: shoppingItems,
    subtitle: 'articles à acheter',
    icon: <ShoppingCart className="w-5 h-5" />,
    iconColor: 'var(--coral)',
    iconBg: 'var(--coral-pale)',
  },
];

const HomeContent = () => {
  const calendarQuery = useFetchCalendarSummary();
  const todosQuery = useFetchTodosSummary();
  const recipesQuery = useFetchRecipesSummary();
  const shoppingQuery = useFetchShoppingListSummary();
  const mealsQuery = useFetchMealsSummary();
  const bankAccountsQuery = useFetchBankAccountsSummary();

  const agenda = calendarQuery.data ?? [];
  const todos = todosQuery.data ?? [];
  const recipes = recipesQuery.data ?? [];
  const shopping = shoppingQuery.data ?? { items: 0 };
  const weeklyMenu = mealsQuery.data ?? { weekLabel: '', days: [] };
  const bankAccounts = bankAccountsQuery.data ?? [];

  const statCards = buildStatCards(
    agenda.length,
    todos.filter((todo) => !todo.completed).length,
    recipes.filter((recipe) => recipe.favorite).length,
    shopping.items
  );

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <AgendaSection events={agenda} />
        <TodosSection todos={todos} />
        <MealsSection weeklyMenu={weeklyMenu} recipes={recipes} />
      </div>
      <div className="mt-4 md:mt-6">
        <BankAccountsSection accounts={bankAccounts} />
      </div>
    </div>
  );
};

export const Home = () => {
  const { families } = useFamily();

  if (families.length === 0) {
    return (
      <div className="relative min-h-full" style={{ background: 'var(--sand)' }}>
        <NoFamilyOverlay />
      </div>
    );
  }

  return <HomeContent />;
};
