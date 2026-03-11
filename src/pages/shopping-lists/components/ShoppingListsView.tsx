import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { ShoppingList } from '../../../stores/shopping-lists/shopping-lists.types';

interface ShoppingListsViewProps {
  lists: ShoppingList[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ShoppingListsView = ({
  lists,
  onCreateNew,
  onSelectList,
  onDelete,
}: ShoppingListsViewProps) => {
  return (
    <div className="p-4 md:p-8" style={{ background: 'var(--sand)', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--stone)' }}>
            Listes de courses
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--mist)' }}>
            {lists.length} liste{lists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold text-white transition-all hover:-translate-y-px"
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
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'var(--ocean-pale)' }}
          >
            <ShoppingCart className="w-8 h-8" style={{ color: 'var(--ocean)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune liste de courses
          </p>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold text-white transition-all hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
              boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            Créer ma première liste
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => {
            const completedCount = list.items.filter((item) => item.completed).length;
            const totalCount = list.items.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isShared = list.type === 'SHARED';

            return (
              <article
                key={list.id}
                className="relative bg-white rounded-[var(--radius-lg)] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 group"
                style={{ boxShadow: 'var(--shadow-soft)' }}
                onClick={() => onSelectList(list.id)}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: isShared
                      ? 'linear-gradient(to right, var(--ocean), var(--ocean-light))'
                      : 'linear-gradient(to right, var(--sage), var(--sage-light))',
                  }}
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
                      <span
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                        style={
                          isShared
                            ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                            : { background: 'var(--sage-pale)', color: 'var(--sage)' }
                        }
                      >
                        {isShared ? 'Partagée' : 'Personnelle'}
                      </span>
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

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs" style={{ color: 'var(--mist)' }}>
                        {totalCount > 0 ? `${completedCount} / ${totalCount} articles` : 'Aucun article'}
                      </span>
                      {totalCount > 0 && (
                        <span className="text-xs font-semibold" style={{ color: 'var(--ocean)' }}>
                          {progressPct}%
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--sand)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progressPct}%`,
                          background: progressPct === 100
                            ? 'var(--sage)'
                            : 'linear-gradient(to right, var(--ocean), var(--ocean-light))',
                        }}
                      />
                    </div>
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
