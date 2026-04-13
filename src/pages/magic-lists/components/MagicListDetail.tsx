import { useState } from 'react';
import dayjs from 'dayjs';
import { ArrowLeft, Plus, Trash2, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  MagicList,
  MagicItem,
  MagicListType,
  CreateMagicItemInput,
  UpdateMagicItemInput,
  MagicItemStatus,
} from '../../../stores/magic-lists/magic-lists.types';
import { AddTaskDialog } from './AddTaskDialog';

interface MagicListDetailProps {
  list: MagicList;
  onBack: () => void;
  onAddItem: (input: CreateMagicItemInput) => void;
  onUpdateItem: (itemId: number, input: UpdateMagicItemInput) => void;
  onDeleteItem: (itemId: number) => void;
  onClearCompleted: () => void;
}

const STATUS_LABELS: Record<MagicItemStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

const STATUS_STYLES: Record<MagicItemStatus, string> = {
  TODO: 'bg-[var(--ocean-pale)] text-[var(--ocean)]',
  IN_PROGRESS: 'bg-[var(--sun-pale)] text-amber-700',
  DONE: 'bg-[var(--sage-pale)] text-[var(--sage)]',
};

const TaskItem = ({
  item,
  listType,
  onUpdateItem,
  onDeleteItem,
}: {
  item: MagicItem;
  listType: MagicListType;
  onUpdateItem: (itemId: number, input: UpdateMagicItemInput) => void;
  onDeleteItem: (itemId: number) => void;
}) => {
  const isCompleted = item.checked || item.status === 'DONE';
  const isLate =
    item.dueDate &&
    !isCompleted &&
    dayjs(item.dueDate).isBefore(dayjs(), 'day');

  return (
    <div
      className="bg-white rounded-[var(--radius-md)] p-4 mb-2.5 flex items-start gap-3.5"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {listType === 'TASK' && (
        <Checkbox
          checked={item.checked ?? false}
          onCheckedChange={(v) => onUpdateItem(item.id, { checked: Boolean(v) })}
          className="mt-0.5 shrink-0"
        />
      )}

      {item.status && (
        <select
          value={item.status}
          onChange={(e) => onUpdateItem(item.id, { status: e.target.value as MagicItemStatus })}
          className={cn(
            'border-none rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold shrink-0 cursor-pointer focus:outline-none',
            STATUS_STYLES[item.status]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {(Object.keys(STATUS_LABELS) as MagicItemStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      )}

      <div className="flex-1 min-w-0">
        <p
          className={cn('font-semibold text-sm m-0', isCompleted && 'line-through opacity-50')}
          style={{ color: 'var(--stone)' }}
        >
          {item.title}
        </p>
        {item.content && (
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--mist)' }}>
            {item.content}
          </p>
        )}
        {item.dueDate && (
          <p
            className="text-xs font-medium mt-1 m-0"
            style={{ color: isLate ? 'var(--coral)' : 'var(--sun)' }}
          >
            Échéance : {dayjs(item.dueDate).format('DD/MM/YYYY')}
          </p>
        )}
      </div>

      <button
        aria-label="Supprimer la tâche"
        className="opacity-40 hover:opacity-100 transition-opacity shrink-0"
        style={{ color: 'var(--coral)' }}
        onClick={() => onDeleteItem(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const SectionHeader = ({
  title,
  count,
  action,
}: {
  title: string;
  count: number;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest m-0" style={{ color: 'var(--mist)' }}>
        {title}
      </p>
      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
        style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
      >
        {count}
      </span>
    </div>
    {action}
  </div>
);

export const MagicListDetail = ({
  list,
  onBack,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onClearCompleted,
}: MagicListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const doneItems = list.items.filter((item) => item.checked || item.status === 'DONE');
  const inProgressItems = list.items.filter((item) => !item.checked && item.status === 'IN_PROGRESS');
  const activeItems = list.items.filter((item) => !item.checked && item.status !== 'DONE' && item.status !== 'IN_PROGRESS');

  const hasGroups = inProgressItems.length > 0 || doneItems.length > 0;

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 shrink-0 mt-1"
          style={{ color: 'var(--ocean)' }}
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <div className="flex-1 min-w-0">
          <h2
            className="font-display text-xl font-bold m-0 truncate"
            style={{ color: 'var(--stone)' }}
          >
            {list.name}
          </h2>
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-1"
            style={
              list.visibility === 'SHARED'
                ? { background: 'var(--coral-pale)', color: 'var(--coral)' }
                : { background: 'var(--sage-pale)', color: 'var(--sage)' }
            }
          >
            {list.visibility === 'SHARED' ? 'Partagée' : 'Personnelle'}
          </span>
        </div>
        <button
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] shrink-0 transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Ajouter un élément
        </button>
      </div>

      {list.items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-[var(--radius-lg)] gap-3"
          style={{ background: 'white', boxShadow: 'var(--shadow-soft)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucun élément pour le moment
          </p>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter le premier élément
          </button>
        </div>
      ) : hasGroups ? (
        <div className="space-y-6">
          {activeItems.length > 0 && (
            <section>
              <SectionHeader title="À faire" count={activeItems.length} />
              {activeItems.map((item) => (
                <TaskItem key={item.id} item={item} listType={list.type} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
              ))}
            </section>
          )}

          {inProgressItems.length > 0 && (
            <section>
              <SectionHeader title="En cours" count={inProgressItems.length} />
              {inProgressItems.map((item) => (
                <TaskItem key={item.id} item={item} listType={list.type} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
              ))}
            </section>
          )}

          {doneItems.length > 0 && (
            <section>
              <SectionHeader
                title="Terminé"
                count={doneItems.length}
                action={
                  <button
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--coral-pale)]"
                    style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
                    onClick={onClearCompleted}
                  >
                    <Eraser className="w-3 h-3" />
                    Nettoyer
                  </button>
                }
              />
              {doneItems.map((item) => (
                <TaskItem key={item.id} item={item} listType={list.type} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
              ))}
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {activeItems.map((item) => (
            <TaskItem key={item.id} item={item} listType={list.type} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
          ))}
        </div>
      )}

      <AddTaskDialog
        open={isAddModalOpen}
        listType={list.type}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={onAddItem}
      />
    </div>
  );
};
