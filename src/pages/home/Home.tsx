import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template.tsx';
import type { DashboardData } from '@/stores/dashboard/dashboard.types.ts';
import { useFetchDashboard } from '@/stores/dashboard/dashboard.queries.ts';
import { useFamily } from '../../contexts/family/family.context.tsx';
import { Calendar, CheckSquare, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { StatCard, type StatCardData } from './components/StatCard.tsx';
import { AgendaSection } from './components/AgendaSection.tsx';
import { TodosSection } from './components/TodosSection.tsx';
import { WeeklyMenusSection } from './components/WeeklyMenusSection.tsx';
import NoFamilyOverlay from '@/pages/home/components/NoFamilyOverlay.tsx';

const buildStatCards = (data: DashboardData): StatCardData[] => [
  {
    title: 'Familles actives',
    value: data.agenda.length,
    subtitle: 'événements à venir',
    icon: <Calendar className="w-5 h-5" />,
    iconColor: 'var(--ocean)',
    iconBg: 'var(--ocean-pale)',
  },
  {
    title: 'Tâches en cours',
    value: data.todos.filter((todo) => !todo.completed).length,
    subtitle: 'tâches actives',
    icon: <CheckSquare className="w-5 h-5" />,
    iconColor: 'var(--sage)',
    iconBg: 'var(--sage-pale)',
  },
  {
    title: 'Recettes',
    value: data.recipes.filter((recipe) => recipe.favorite).length,
    subtitle: 'recettes favorites',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    iconColor: 'var(--sun)',
    iconBg: 'var(--sun-pale)',
  },
  {
    title: 'Liste de courses',
    value: data.shopping.items,
    subtitle: 'articles à acheter',
    icon: <ShoppingCart className="w-5 h-5" />,
    iconColor: 'var(--coral)',
    iconBg: 'var(--coral-pale)',
  },
];

const HomeContent = ({ data }: { data: DashboardData }) => (
  <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      {buildStatCards(data).map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      <AgendaSection events={data.agenda} />
      <TodosSection todos={data.todos} />
      <WeeklyMenusSection weeklyMenu={data.weeklyMenu} recipes={data.recipes} />
    </div>
  </div>
);

const HomeWithData = withFetchTemplate<any, DashboardData>(HomeContent, useFetchDashboard);

export const Home = () => {
  const { families } = useFamily();

  if (families.length === 0) {
    return (
      <div className="relative min-h-full" style={{ background: 'var(--sand)' }}>
        <NoFamilyOverlay />
      </div>
    );
  }

  return <HomeWithData />;
};
