import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardAgendaItem, ItemVisibility } from '@/stores/dashboard/dashboard.types.ts';

const getVisibilityLabel = (visibility: ItemVisibility) =>
  visibility === 'PERSONAL' ? 'Personnel' : 'Famille';

export const AgendaSection = ({ events }: { events: DashboardAgendaItem[] }) => (
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
      {events.map((event) => (
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
                'inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1.5',
                event.visibility === 'FAMILY'
                  ? 'bg-[var(--ocean-pale)] text-[var(--ocean)]'
                  : 'bg-[var(--sand)] text-[var(--mist)]'
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
              <div
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold"
                style={{ background: 'var(--mist)', color: 'white' }}
              >
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
);
