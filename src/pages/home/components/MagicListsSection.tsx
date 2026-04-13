import { CheckSquare } from 'lucide-react';
import type { MagicListSummaryItem } from '../../../stores/magic-lists/magic-lists.types';

const KIND_LABELS: Record<MagicListSummaryItem['kind'], string> = {
  SIMPLE: 'Simple',
  TASK: 'Tâches',
  TEMPLATE: 'Template',
};

export const MagicListsSection = ({ magicListItems }: { magicListItems: MagicListSummaryItem[] }) => (
  <div
    className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
    style={{ boxShadow: 'var(--shadow-soft)' }}
  >
    <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-black/5">
      <div
        className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
        style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
      >
        <CheckSquare className="w-4 h-4" />
      </div>
      <h2 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
        Magic Lists
      </h2>
    </div>
    <ul className="list-none p-0 m-0 divide-y divide-black/5">
      {magicListItems.map((list) => (
        <li key={list.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--sand)] transition-colors">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium m-0 truncate" style={{ color: 'var(--stone)' }}>
              {list.name}
            </p>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
              {KIND_LABELS[list.kind]} · {list.itemCount} élément{list.itemCount !== 1 ? 's' : ''}
            </span>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={
              list.type === 'SHARED'
                ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                : { background: 'var(--sage-pale)', color: 'var(--sage)' }
            }
          >
            {list.type === 'SHARED' ? 'Partagée' : 'Perso'}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
