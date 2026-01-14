import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { getDashboard } from '../../services/dashboard.service.ts';
import { useFetchDashboard } from './dashboard.queries.ts';

jest.mock('../../services/dashboard.service.ts', () => ({
  getDashboard: jest.fn()
}));

describe('dashboard queries', () => {
  test('should fetch dashboard data', async () => {
    jest.mocked(getDashboard).mockResolvedValue({
      agenda: [],
      todos: [],
      weeklyMenu: { weekLabel: 'Jul 9', days: [] },
      recipes: [],
      shopping: { items: 0 }
    });

    const { result } = renderQueryHook(() => useFetchDashboard());

    expect(getDashboard).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
