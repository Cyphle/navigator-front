import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render.tsx';
import { getAccount, getAccountSummaries } from '../../services/account.service.ts';
import { useFetchAccount, useFetchAccountSummaries } from './account.queries.ts';

jest.mock('../../services/account.service.ts', () => ({
  getAccountSummaries: jest.fn(),
  getAccount: jest.fn()
}));

describe('account queries', () => {
  test('should fetch accounts', async () => {
    jest.mocked(getAccountSummaries).mockResolvedValue([{
      id: 1,
      name: 'My Account',
      type: 'PERSONAL',
      startingBalance: 100.0,
      currentBalance: 100.0,
      projectedBalance: 100.0
    }]);

    const { result } = renderQueryHook(() => useFetchAccountSummaries());

    expect(getAccountSummaries).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test('should fetch one account', async () => {
    jest.mocked(getAccount).mockResolvedValue({
      id: 1,
      summary: {
        id: 1,
        name: 'My Account',
        type: 'PERSONAL',
        startingBalance: 100.0,
        currentBalance: 100.0,
        projectedBalance: 100.0
      },
      budgets: [],
      transactions: []
    });

    const { result } = renderQueryHook(() => useFetchAccount(1));

    expect(getAccount).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});