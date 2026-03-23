import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateEventForm } from './CreateEventForm';
import { aCalendar } from '../../../../test-utils/factories';

describe('CreateEventForm', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  const mockCalendars = [
    aCalendar({ id: 1, name: 'Perso', color: '#1890ff' }),
    aCalendar({ id: 2, name: 'Famille', color: '#52c41a' }),
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders when open', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    expect(screen.getByText('Nouvel événement')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <CreateEventForm
        open={false}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    expect(screen.queryByText('Nouvel événement')).not.toBeInTheDocument();
  });

  test('shows calendar indicator when a calendar is selected', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={1}
      />
    );

    expect(screen.getByText('Perso')).toBeInTheDocument();
  });

  test('shows loading state on submit button', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        isLoading={true}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    expect(screen.getByText('Création...')).toBeInTheDocument();
  });

  test('submit button is disabled when title is empty', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  test('shows recurrence options', () => {
    render(
      <CreateEventForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        calendars={mockCalendars}
        selectedCalendarId={null}
      />
    );

    expect(screen.getByText('Récurrence')).toBeInTheDocument();
    expect(screen.getByText('Aucune')).toBeInTheDocument();
  });
});
