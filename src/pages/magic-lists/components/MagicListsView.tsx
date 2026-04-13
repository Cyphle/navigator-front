import { useState } from 'react';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MagicListSummaryItem, MagicListType } from '../../../stores/magic-lists/magic-lists.types';

interface MagicListsViewProps {
  lists: MagicListSummaryItem[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
}

const TYPE_CONFIG: Record<MagicListType, { label: string; icon: string }> = {
  SIMPLE: { label: 'Simple', icon: '📋' },
  TASK: { label: 'Tâches', icon: '✅' },
  TEMPLATE: { label: 'Template', icon: '🔁' },
};

const FILTER_OPTIONS: { value: MagicListType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'SIMPLE', label: '📋 Simple' },
  { value: 'TASK', label: '✅ Tâches' },
  { value: 'TEMPLATE', label: '🔁 Template' },
];

export const MagicListsView = ({ lists, onCreateNew, onSelectList, onDelete }: MagicListsViewProps) => {
  const [typeFilter, setTypeFilter] = useState<MagicListType | 'ALL'>('ALL');

  const filteredLists = typeFilter === 'ALL'
    ? lists
    : lists.filter((list) => list.type === typeFilter);

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Type filter */}
        {lists.length > 0 && (
          <div className="flex items-center gap-1.5">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                  typeFilter === opt.value
                    ? 'border-transparent text-white'
                    : 'border-black/10 hover:border-black/20'
                )}
                style={
                  typeFilter === opt.value
                    ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }
                    : { color: 'var(--stone)' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px shrink-0"
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
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            <ClipboardList className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune liste de todos
          </p>
          <button
            onClick={onCreateNew}
            className="text-sm font-semibold px-5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
          >
            Créer ma première liste
          </button>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune liste de ce type
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLists.map((list) => {
            const typeInfo = TYPE_CONFIG[list.type];
            return (
              <article
                key={list.id}
                className="bg-white rounded-[var(--radius-lg)] p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group"
                style={{ boxShadow: 'var(--shadow-soft)' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}
                onClick={() => onSelectList(list.id)}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: list.visibility === 'SHARED'
                      ? 'linear-gradient(to right, var(--coral), var(--coral-light, #ff8a7a))'
                      : 'linear-gradient(to right, var(--sage), var(--sage-light))',
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between mb-2 mt-1">
                  <h3
                    className="font-display text-[1.1rem] font-semibold truncate flex-1 min-w-0"
                    style={{ color: 'var(--stone)' }}
                  >
                    {list.name}
                  </h3>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={
                      list.visibility === 'SHARED'
                        ? { background: 'var(--coral-pale)', color: 'var(--coral)' }
                        : { background: 'var(--sage-pale)', color: 'var(--sage)' }
                    }
                  >
                    {list.visibility === 'SHARED' ? 'Partagée' : 'Personnelle'}
                  </span>

                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
                  >
                    <span>{typeInfo.icon}</span>
                    {typeInfo.label}
                  </span>
                </div>

                <p className="text-sm pt-3 border-t border-black/5 m-0" style={{ color: 'var(--mist)' }}>
                  {list.itemCount} élément{list.itemCount !== 1 ? 's' : ''}
                </p>

                {/* Delete button */}
                <button
                  aria-label="Supprimer"
                  className="absolute top-4 right-4 w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--coral-pale)]"
                  style={{ color: 'var(--coral)' }}
                  onClick={(e) => { e.stopPropagation(); onDelete(list.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
