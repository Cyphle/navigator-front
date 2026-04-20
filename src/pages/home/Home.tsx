import { useFamily } from '../../contexts/family/family.context.tsx';
import { Calendar, CheckSquare, UtensilsCrossed } from 'lucide-react';
import { StatCard, type StatCardData } from './components/StatCard.tsx';
import { AgendaSection } from './components/AgendaSection.tsx';
import { MagicListsSection } from './components/MagicListsSection.tsx';
import { MealsSection } from './components/MealsSection.tsx';
import NoFamilyOverlay from '@/pages/home/components/NoFamilyOverlay.tsx';
import { useFetchCalendarSummary } from '@/stores/calendars/calendars.queries.ts';
import { useFetchMagicListsSummary } from '@/stores/magic-lists/magic-lists.queries.ts';
import { useFetchRecipesSummary } from '@/stores/recipes/recipes.queries.ts';
import { useFetchMealsSummary } from '@/stores/meals/meals.queries.ts';
import { useFetchBankAccountsSummary } from '@/stores/bank-accounts/bank-accounts.queries.ts';
import { BankAccountsSection } from './components/BankAccountsSection.tsx';

const buildStatCards = (
  agendaCount: number,
  activeMagicListItemsCount: number,
  favoriteRecipesCount: number
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
    value: activeMagicListItemsCount,
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
];

const HomeContent = () => {
  const calendarQuery = useFetchCalendarSummary();
  const magicListsQuery = useFetchMagicListsSummary();
  const recipesQuery = useFetchRecipesSummary();
  const mealsQuery = useFetchMealsSummary();
  const bankAccountsQuery = useFetchBankAccountsSummary();

  const agenda = calendarQuery.data ?? [];
  const magicListItems = magicListsQuery.data ?? [];
  const recipes = recipesQuery.data ?? [];
  const weeklyMenu = mealsQuery.data ?? { weekLabel: '', days: [] };
  const bankAccounts = bankAccountsQuery.data ?? [];

  const statCards = buildStatCards(
    agenda.length,
    magicListItems.reduce((sum, list) => sum + list.itemCount, 0),
    recipes.filter((recipe) => recipe.favorite).length
  );

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <AgendaSection events={agenda} />
        <MagicListsSection magicListItems={magicListItems} />
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
