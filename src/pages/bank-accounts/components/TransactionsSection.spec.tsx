import { render, screen } from '../../../../test-utils';
import { TransactionsSection } from './TransactionsSection';
import { aBankAccountMonthView, aBudgetMonthView } from '../../../../test-utils/factories';
import type { Credit, Expense, Charge } from '../../../stores/bank-accounts/bank-accounts.types';

describe('TransactionsSection', () => {
  test('shows empty state when no transactions', () => {
    const account = aBankAccountMonthView({
      credits: [],
      expenses: [],
      charges: [],
      budgets: [],
    });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Aucune transaction')).toBeInTheDocument();
  });

  test('renders credit descriptions', () => {
    const credit: Credit = { id: 1, description: 'Salaire', amount: 2500, creditDate: '2026-03-28' };
    const account = aBankAccountMonthView({ credits: [credit], charges: [], expenses: [], budgets: [] });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Salaire')).toBeInTheDocument();
  });

  test('renders free expense descriptions', () => {
    const expense: Expense = {
      id: 1,
      description: 'Restaurant',
      amount: 45,
      expenseDate: '2026-03-15',
      debitDate: '2026-03-16',
    };
    const account = aBankAccountMonthView({ expenses: [expense], credits: [], charges: [], budgets: [] });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
  });

  test('renders charge descriptions', () => {
    const charge: Charge = { id: 1, description: 'Loyer', amount: 900, debitDate: '2026-03-01', periodicity: 'MONTHLY' };
    const account = aBankAccountMonthView({ charges: [charge], credits: [], expenses: [], budgets: [] });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Loyer')).toBeInTheDocument();
  });

  test('renders budget expense descriptions', () => {
    const budget = aBudgetMonthView({
      name: 'Alimentation',
      expenses: [{ id: 1, description: 'Courses', amount: 85, expenseDate: '2026-03-05', debitDate: '2026-03-06' }],
    });
    const account = aBankAccountMonthView({ budgets: [budget], credits: [], charges: [], expenses: [] });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Courses')).toBeInTheDocument();
  });

  test('displays multiple transactions', () => {
    const credit: Credit = { id: 1, description: 'Salaire', amount: 2500, creditDate: '2026-03-28' };
    const expense: Expense = { id: 1, description: 'Taxi', amount: 22, expenseDate: '2026-03-18', debitDate: '2026-03-19' };
    const account = aBankAccountMonthView({ credits: [credit], expenses: [expense], charges: [], budgets: [] });
    render(<TransactionsSection account={account} />);
    expect(screen.getByText('Salaire')).toBeInTheDocument();
    expect(screen.getByText('Taxi')).toBeInTheDocument();
  });
});
