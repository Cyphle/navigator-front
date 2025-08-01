import { render, screen } from '../../../test-utils';
import { AccountsPage } from './Accounts.tsx';
import { useFetchAccountSummaries } from '../../stores/account/account.queries.ts';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../stores/account/account.queries.ts', () => ({
  useFetchAccountSummaries: jest.fn(),
}));

describe('Accounts Page', () => {
  
  it('should render data', () => {
    (useFetchAccountSummaries as jest.Mock).mockImplementation(() => ({
      data: [
        {
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
          projectedBalance: 100.0
        }
      ],
      isPending: false,
    }));

    render(<AccountsPage/>);

    const listElements = screen.getAllByRole('listitem');

    expect(listElements).toHaveLength(1);
  });
});
