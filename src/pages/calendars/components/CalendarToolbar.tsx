import { Plus } from 'lucide-react';
import type { Calendar } from '@/stores/calendars/calendars.types.ts';

interface CalendarToolbarProps {
  calendars: Calendar[];
  visibleCalendars: Set<number>;
  onToggleCalendar: (id: number) => void;
  onCreateCalendar: () => void;
}

export const CalendarToolbar = ({
  calendars,
  visibleCalendars,
  onToggleCalendar,
  onCreateCalendar,
}: CalendarToolbarProps) => (
  <div className="flex flex-wrap gap-2">
    {calendars.map((cal) => {
      const active = visibleCalendars.has(cal.id);
      return (
        <button
          key={cal.id}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
          style={{
            borderColor: cal.color,
            background: active ? `${cal.color}18` : 'transparent',
            color: active ? cal.color : 'var(--mist)',
          }}
          onClick={() => onToggleCalendar(cal.id)}
        >
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cal.color }} />
          {cal.name}
          {cal.type === 'SHARED' && (
            <span className="opacity-60 text-[9px] uppercase tracking-wide">· Partagé</span>
          )}
        </button>
      );
    })}
    <button
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed transition-colors hover:bg-[var(--ocean-pale)]"
      style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
      onClick={onCreateCalendar}
    >
      <Plus className="w-3 h-3" />
      Nouveau
    </button>
  </div>
);
