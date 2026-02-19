import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { getFamilies } from '../../services/families.service.ts';
import { useFetchFamilies } from './families.queries.ts';

jest.mock('../../services/families.service.ts', () => ({
  getFamilies: jest.fn()
}));

describe('families queries', () => {
  test('should fetch families data', async () => {
    jest.mocked(getFamilies).mockResolvedValue([
      {
        id: 1,
        name: 'Famille Martin',
        owner: { id: 1, email: 'sarah.martin@banana.fr', role: 'Owner', relation: 'Owner' },
        members: [],
        status: 'ACTIVE'
      }
    ]);

    const { result } = renderQueryHook(() => useFetchFamilies());

    expect(getFamilies).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
