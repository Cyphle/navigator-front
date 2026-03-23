import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CalendarToolbar } from './CalendarToolbar';
import { aCalendar } from '../../../../test-utils/factories';

describe('CalendarToolbar', () => {
  const onToggleCalendar = jest.fn();
  const onCreateCalendar = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders a chip for each calendar', () => {
    const calendars = [
      aCalendar({ id: 1, name: 'Perso' }),
      aCalendar({ id: 2, name: 'Famille' }),
    ];

    render(
      <CalendarToolbar
        calendars={calendars}
        visibleCalendars={new Set([1, 2])}
        onToggleCalendar={onToggleCalendar}
        onCreateCalendar={onCreateCalendar}
      />
    );

    expect(screen.getByText('Perso')).toBeInTheDocument();
    expect(screen.getByText('Famille')).toBeInTheDocument();
  });

  test('shows "· Partagé" label for shared calendars', () => {
    const calendars = [aCalendar({ id: 1, name: 'Famille', type: 'SHARED' })];

    render(
      <CalendarToolbar
        calendars={calendars}
        visibleCalendars={new Set([1])}
        onToggleCalendar={onToggleCalendar}
        onCreateCalendar={onCreateCalendar}
      />
    );

    expect(screen.getByText('· Partagé')).toBeInTheDocument();
  });

  test('calls onToggleCalendar with calendar id when chip is clicked', () => {
    const calendars = [aCalendar({ id: 42, name: 'Perso' })];

    render(
      <CalendarToolbar
        calendars={calendars}
        visibleCalendars={new Set([42])}
        onToggleCalendar={onToggleCalendar}
        onCreateCalendar={onCreateCalendar}
      />
    );

    fireEvent.click(screen.getByText('Perso'));

    expect(onToggleCalendar).toHaveBeenCalledWith(42);
  });

  test('calls onCreateCalendar when "Nouveau" button is clicked', () => {
    render(
      <CalendarToolbar
        calendars={[]}
        visibleCalendars={new Set()}
        onToggleCalendar={onToggleCalendar}
        onCreateCalendar={onCreateCalendar}
      />
    );

    fireEvent.click(screen.getByText('Nouveau'));

    expect(onCreateCalendar).toHaveBeenCalled();
  });
});
