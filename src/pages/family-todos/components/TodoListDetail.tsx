import { useState } from 'react';
import dayjs from 'dayjs';
import { ArrowLeft, Plus, Trash2, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  TodoList,
  TodoItem,
  CreateTodoItemInput,
  TodoStatus,
} from '../../../stores/family-todos/family-todos.types';
import { AddTaskDialog } from './AddTaskDialog';

interface TodoListDetailProps {
  list: TodoList;
  onBack: () => void;
  onAddItem: (input: CreateTodoItemInput) => void;
  onUpdateItem: (itemId: number, status: TodoStatus) => void;
  onDeleteItem: (itemId: number) => void;
  onClearCompleted: () => void;
}

const STATUS_LABELS: Record<TodoStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

const STATUS_STYLES: Record<TodoStatus, string> = {
  TODO: 'bg-[var(--ocean-pale)] text-[var(--ocean)]',
  IN_PROGRESS: 'bg-[var(--sun-pale)] text-amber-700',
  DONE: 'bg-[var(--sage-pale)] text-[var(--sage)]',
};

const TaskItem = ({
  item,
  onUpdateItem,
  onDeleteItem,
}: {
  item: TodoItem;
  onUpdateItem: (itemId: number, status: TodoStatus) => void;
  onDeleteItem: (itemId: number) => void;
}) => {
  const isLate =
    item.dueDate &&
    item.status !== 'DONE' &&
    dayjs(item.dueDate).isBefore(dayjs(), 'day');

  return (
    <div
      className="bg-white rounded-[var(--radius-md)] p-4 mb-2.5 flex items-start gap-3.5"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <select
        value={item.status}
        onChange={(e) => onUpdateItem(item.id, e.target.value as TodoStatus)}
        className={cn(
          'border-none rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold shrink-0 cursor-pointer focus:outline-none',
          STATUS_STYLES[item.status]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(Object.keys(STATUS_LABELS) as TodoStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      <div className="flex-1 min-w-0">
        <p
          className={cn('font-semibold text-sm m-0', item.status === 'DONE' && 'line-through opacity-50')}
          style={{ color: 'var(--stone)' }}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--mist)' }}>
            {item.description}
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

export const TodoListDetail = ({
  list,
  onBack,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onClearCompleted,
}: TodoListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const todoItems = list.items.filter((item) => item.status === 'TODO');
  const inProgressItems = list.items.filter((item) => item.status === 'IN_PROGRESS');
  const doneItems = list.items.filter((item) => item.status === 'DONE');

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
              list.type === 'SHARED'
                ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                : { background: 'var(--sage-pale)', color: 'var(--sage)' }
            }
          >
            {list.type === 'SHARED' ? 'Partagée' : 'Personnelle'}
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
          Ajouter une tâche
        </button>
      </div>

      {list.items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-[var(--radius-lg)] gap-3"
          style={{ background: 'white', boxShadow: 'var(--shadow-soft)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune tâche pour le moment
          </p>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter la première tâche
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {todoItems.length > 0 && (
            <section>
              <SectionHeader title="À faire" count={todoItems.length} />
              {todoItems.map((item) => (
                <TaskItem key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
              ))}
            </section>
          )}

          {inProgressItems.length > 0 && (
            <section>
              <SectionHeader title="En cours" count={inProgressItems.length} />
              {inProgressItems.map((item) => (
                <TaskItem key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
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
                <TaskItem key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
              ))}
            </section>
          )}
        </div>
      )}

      <AddTaskDialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={onAddItem}
      />
    </div>
  );
};
