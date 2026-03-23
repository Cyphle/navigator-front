import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardTodoItem, ItemVisibility } from '../../../stores/dashboard/dashboard.types';

const getVisibilityLabel = (visibility: ItemVisibility) =>
  visibility === 'PERSONAL' ? 'Personnel' : 'Famille';

export const TodosSection = ({ todos }: { todos: DashboardTodoItem[] }) => (
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
      {todos.map((todo) => (
        <li key={todo.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--sand)] transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ background: 'var(--sage-light)' }}
          >
            {todo.assignee.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn('text-sm font-medium m-0 truncate', todo.completed && 'line-through opacity-40')}
              style={{ color: 'var(--stone)' }}
            >
              {todo.label}
            </p>
            <span
              className={cn(
                'inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1',
                todo.visibility === 'FAMILY'
                  ? 'bg-[var(--ocean-pale)] text-[var(--ocean)]'
                  : 'bg-[var(--sand)] text-[var(--mist)]'
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
);
