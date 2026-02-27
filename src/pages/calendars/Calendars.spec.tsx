import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils/render';
import { aCalendar } from '../../../test-utils/factories';
import * as calendarsService from '../../services/calendars.service';
import { Calendars } from './Calendars';

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn(() => ({
    format: jest.fn(() => '01/01/2026'),
    isSame: jest.fn(() => false),
  }));
  mockDayjs.extend = jest.fn();
  return {
    __esModule: true,
    default: mockDayjs,
  };
});

jest.mock('../../services/calendars.service', () => ({
  getAllCalendars: jest.fn(),
  getCalendarById: jest.fn(),
  createCalendar: jest.fn(),
  deleteCalendar: jest.fn(),
  addEventToCalendar: jest.fn(),
  updateEventInCalendar: jest.fn(),
  deleteEventFromCalendar: jest.fn(),
}));

describe('Calendars', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state', () => {
    jest.mocked(calendarsService.getAllCalendars).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<Calendars />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows error state', async () => {
    jest
      .mocked(calendarsService.getAllCalendars)
      .mockRejectedValue(new Error('Network error'));

    render(<Calendars />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('fetches calendars on mount', async () => {
    const mockCalendars = [aCalendar({ id: 1, name: 'Mon calendrier' })];
    jest.mocked(calendarsService.getAllCalendars).mockResolvedValue(mockCalendars);

    render(<Calendars />);

    await waitFor(() => {
      expect(calendarsService.getAllCalendars).toHaveBeenCalled();
    });
  });
});
