import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, ArrowRight, Star } from 'lucide-react';
import type { DashboardWeeklyMenu, DashboardRecipe } from '../../../stores/dashboard/dashboard.types';

interface WeeklyMenusSectionProps {
  weeklyMenu: DashboardWeeklyMenu;
  recipes: DashboardRecipe[];
}

export const WeeklyMenusSection = ({ weeklyMenu, recipes }: WeeklyMenusSectionProps) => (
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
          {weeklyMenu.weekLabel}
        </p>
      </div>

      <div className="space-y-4">
        {weeklyMenu.days.map((day) => (
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
          {recipes
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
);
