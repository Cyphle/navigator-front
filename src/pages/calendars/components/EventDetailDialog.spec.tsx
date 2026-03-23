import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { EventDetailDialog } from './EventDetailDialog';
import { aCalendar, aCalendarEvent } from '../../../../test-utils/factories';

describe('EventDetailDialog', () => {
  const onClose = jest.fn();
  const onDelete = jest.fn();

  const calendar = aCalendar({ id: 1, name: 'Perso', color: '#1890ff' });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when event is null', () => {
    render(<EventDetailDialog event={null} onClose={onClose} onDelete={onDelete} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders event title and calendar name', () => {
    const event = { ...aCalendarEvent({ title: 'Réunion équipe', time: '10:00', duration: 60, recurrence: 'NONE' }), calendar };

    render(<EventDetailDialog event={event} onClose={onClose} onDelete={onDelete} />);

    expect(screen.getByText('Réunion équipe')).toBeInTheDocument();
    expect(screen.getByText('Perso')).toBeInTheDocument();
  });

  test('renders event details: time and duration', () => {
    const event = { ...aCalendarEvent({ time: '14:30', duration: 90, recurrence: 'NONE' }), calendar };

    render(<EventDetailDialog event={event} onClose={onClose} onDelete={onDelete} />);

    expect(screen.getByText('14:30')).toBeInTheDocument();
    expect(screen.getByText('90 min')).toBeInTheDocument();
  });

  test('shows recurrence label when recurrence is not NONE', () => {
    const event = { ...aCalendarEvent({ recurrence: 'WEEKLY' }), calendar };

    render(<EventDetailDialog event={event} onClose={onClose} onDelete={onDelete} />);

    expect(screen.getByText('Hebdomadaire')).toBeInTheDocument();
  });

  test('calls onClose when "Fermer" button is clicked', () => {
    const event = { ...aCalendarEvent({ recurrence: 'NONE' }), calendar };

    render(<EventDetailDialog event={event} onClose={onClose} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Fermer'));

    expect(onClose).toHaveBeenCalled();
  });

  test('calls onDelete and onClose when "Supprimer" button is clicked', () => {
    const event = { ...aCalendarEvent({ id: 5, calendarId: 1, recurrence: 'NONE' }), calendar };

    render(<EventDetailDialog event={event} onClose={onClose} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Supprimer'));

    expect(onDelete).toHaveBeenCalledWith(1, 5);
    expect(onClose).toHaveBeenCalled();
  });
});
