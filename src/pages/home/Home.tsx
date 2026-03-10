import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template.tsx';
import { DashboardData, ItemVisibility } from '../../stores/dashboard/dashboard.types.ts';
import { useFetchDashboard } from '../../stores/dashboard/dashboard.queries.ts';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, CheckSquare, ShoppingCart, ArrowRight, Star, Plus, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const getVisibilityLabel = (visibility: ItemVisibility) => {
  return visibility === 'PERSONAL' ? 'Personnel' : 'Famille';
};

const STAT_CARDS = (upcomingEvents: number, activeTodos: number, favoriteRecipes: number, shoppingItems: number) => [
  {
    title: 'Familles actives',
    value: upcomingEvents,
    subtitle: 'événements à venir',
    icon: <Calendar className="w-5 h-5" />,
    iconColor: 'var(--ocean)',
    iconBg: 'var(--ocean-pale)',
    bubbleColor: 'var(--ocean-pale)',
  },
  {
    title: 'Tâches en cours',
    value: activeTodos,
    subtitle: 'tâches actives',
    icon: <CheckSquare className="w-5 h-5" />,
    iconColor: 'var(--sage)',
    iconBg: 'var(--sage-pale)',
    bubbleColor: 'var(--sage-pale)',
  },
  {
    title: 'Recettes',
    value: favoriteRecipes,
    subtitle: 'recettes favorites',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    iconColor: 'var(--sun)',
    iconBg: 'var(--sun-pale)',
    bubbleColor: 'var(--sun-pale)',
  },
  {
    title: 'Liste de courses',
    value: shoppingItems,
    subtitle: 'articles à acheter',
    icon: <ShoppingCart className="w-5 h-5" />,
    iconColor: 'var(--coral)',
    iconBg: 'var(--coral-pale)',
    bubbleColor: 'var(--coral-pale)',
  },
];

const HomeContent = ({ data }: { data: DashboardData }) => {
  const upcomingEvents = data.agenda.length;
  const activeTodos = data.todos.filter((todo) => !todo.completed).length;
  const favoriteRecipes = data.recipes.filter((recipe) => recipe.favorite).length;
  const statCards = STAT_CARDS(upcomingEvents, activeTodos, favoriteRecipes, data.shopping.items);

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-[var(--radius-lg)] p-5 relative overflow-hidden"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-4"
              style={{ background: stat.iconBg, color: stat.iconColor }}
            >
              {stat.icon}
            </div>
            {/* Value */}
            <p
              className="font-display text-3xl font-bold m-0 leading-none"
              style={{ color: 'var(--stone)' }}
            >
              {stat.value}
            </p>
            <p className="text-xs mt-1 m-0" style={{ color: 'var(--mist)' }}>
              {stat.subtitle}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-3 m-0" style={{ color: 'var(--mist)' }}>
              {stat.title}
            </p>
            {/* Decorative bubble */}
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-[0.08]"
              style={{ background: stat.iconColor }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Agenda */}
        <div
          className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
                style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
                Agenda familial
              </h2>
            </div>
          </div>
          <ul className="list-none p-0 m-0 divide-y divide-black/5">
            {data.agenda.map((event) => (
              <li key={event.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[var(--sand)] transition-colors">
                <span
                  className="w-1 h-12 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: event.accentColor }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium m-0 truncate" style={{ color: 'var(--stone)' }}>
                    {event.title}
                  </p>
                  <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--mist)' }}>
                    {event.time} · {event.person}
                  </p>
                  <span
                    className={cn(
                      "inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1.5",
                      event.visibility === 'FAMILY'
                        ? "bg-[var(--ocean-pale)] text-[var(--ocean)]"
                        : "bg-[var(--sand)] text-[var(--mist)]"
                    )}
                  >
                    {getVisibilityLabel(event.visibility)}
                  </span>
                </div>
                <div className="flex -space-x-2 shrink-0">
                  {event.attendees.slice(0, 2).map((name) => (
                    <Avatar key={name} className="w-6 h-6 border-2 border-white">
                      <AvatarFallback className="text-[8px] font-bold text-white" style={{ background: 'var(--ocean-light)' }}>
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {event.attendees.length > 2 && (
                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold" style={{ background: 'var(--mist)', color: 'white' }}>
                      +{event.attendees.length - 2}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-black/5">
            <Button variant="ghost" className="w-full justify-between text-xs font-medium" style={{ color: 'var(--ocean)' }}>
              Voir le calendrier
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Todos */}
        <div
          className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
                style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
              >
                <CheckSquare className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
                Todos familiaux
              </h2>
            </div>
          </div>
          <ul className="list-none p-0 m-0 divide-y divide-black/5">
            {data.todos.map((todo) => (
              <li key={todo.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--sand)] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: 'var(--sage-light)' }}
                >
                  {todo.assignee.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn("text-sm font-medium m-0 truncate", todo.completed && "line-through opacity-40")}
                    style={{ color: 'var(--stone)' }}
                  >
                    {todo.label}
                  </p>
                  <span
                    className={cn(
                      "inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1",
                      todo.visibility === 'FAMILY'
                        ? "bg-[var(--ocean-pale)] text-[var(--ocean)]"
                        : "bg-[var(--sand)] text-[var(--mist)]"
                    )}
                  >
                    {getVisibilityLabel(todo.visibility)}
                  </span>
                </div>
                {todo.completed && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
                  >
                    <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-black/5">
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-medium gap-2"
              style={{ color: 'var(--sage)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une tâche
            </Button>
          </div>
        </div>

        {/* Weekly Menus */}
        <div
          className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
                style={{ background: 'var(--sun-pale)', color: 'var(--sun)' }}
              >
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
                Menus de la semaine
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <div
              className="rounded-[var(--radius-sm)] px-4 py-3 mb-5"
              style={{ background: 'var(--ocean-pale)', borderLeft: '3px solid var(--ocean)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide m-0 mb-0.5" style={{ color: 'var(--ocean)' }}>
                Période actuelle
              </p>
              <p className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
                {data.weeklyMenu.weekLabel}
              </p>
            </div>

            <div className="space-y-4">
              {data.weeklyMenu.days.map((day) => (
                <div key={day.id}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 m-0" style={{ color: 'var(--mist)' }}>
                    {day.label}
                  </p>
                  <div className="space-y-1.5">
                    {day.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between bg-[var(--sand)] rounded-[var(--radius-sm)] px-3 py-2 hover:bg-[var(--sage-pale)] transition-colors"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--stone)' }}>
                            {entry.name}
                            {entry.favorite && <Star className="w-3 h-3" style={{ color: 'var(--sun)', fill: 'var(--sun)' }} />}
                          </div>
                          <p className="text-[10px] m-0" style={{ color: 'var(--mist)' }}>
                            {entry.time} · {entry.person}
                          </p>
                        </div>
                        <div
                          className="w-6 h-6 rounded-md"
                          style={{ backgroundColor: entry.thumbnailColor, opacity: 0.6 }}
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-black/5">
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--mist)' }}>
                Recettes sélectionnées
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.recipes
                  .filter((recipe) => recipe.selectedForWeek)
                  .map((recipe) => (
                    <Badge
                      key={recipe.id}
                      className="text-[10px] font-semibold rounded-full px-2.5 py-0.5 border-none"
                      style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
                    >
                      {recipe.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-black/5">
            <Button variant="ghost" className="w-full justify-between text-xs font-medium" style={{ color: 'var(--coral)' }}>
              Voir la liste de courses
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Home = withFetchTemplate<any, DashboardData>(HomeContent, useFetchDashboard);
