import { Plus, Trash2, Utensils, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import type { MealsList } from '../../../stores/meals/meals.types';

interface MealsListsViewProps {
  lists: MealsList[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
}

export const MealsListsView = ({
  lists,
  onCreateNew,
  onSelectList,
  onDelete,
}: MealsListsViewProps) => {
  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle liste
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            <Utensils className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune liste de menus planifiés
          </p>
          <button
            onClick={onCreateNew}
            className="text-sm font-semibold px-5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
          >
            Créer ma première liste
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => {
            const startDate = dayjs(list.startDate);
            const endDate = dayjs(list.endDate);
            const daysCount = endDate.diff(startDate, 'day') + 1;

            return (
              <article
                key={list.id}
                className="relative bg-white rounded-[var(--radius-lg)] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 group"
                style={{ boxShadow: 'var(--shadow-soft)' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}
                onClick={() => onSelectList(list.id)}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(to right, var(--sage), var(--sage-light))',
                  }}
                  aria-hidden="true"
                />

                <div className="p-5 pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display text-[1.05rem] font-semibold truncate"
                        style={{ color: 'var(--stone)' }}
                      >
                        {list.name}
                      </h3>
                    </div>
                    <button
                      className="ml-2 p-1.5 rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      style={{ color: 'var(--coral)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(list.id);
                      }}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Date range */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mist)' }} />
                    <span className="text-xs" style={{ color: 'var(--mist)' }}>
                      {startDate.format('DD/MM/YYYY')} – {endDate.format('DD/MM/YYYY')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-black/5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--sand)', color: 'var(--mist)' }}
                    >
                      {daysCount} jour{daysCount !== 1 ? 's' : ''}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
                    >
                      {list.recipes.length} recette{list.recipes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
