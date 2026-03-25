import { render, screen, fireEvent } from '../../../../test-utils';
import { ExpensesSection } from './ExpensesSection';
import type { Expense } from '../../../stores/bank-accounts/bank-accounts.types';

const anExpense = (overrides: Partial<Expense> = {}): Expense => ({
  id: overrides.id ?? 1,
  description: overrides.description ?? 'Restaurant',
  amount: overrides.amount ?? 45,
  expenseDate: overrides.expenseDate ?? '2026-03-15',
  debitDate: overrides.debitDate ?? '2026-03-16',
});

describe('ExpensesSection', () => {
  test('shows empty state when no expenses', () => {
    render(<ExpensesSection expenses={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Aucune dépense libre')).toBeInTheDocument();
  });

  test('clicking "Ajouter une dépense" calls onAdd', () => {
    const onAdd = jest.fn();
    render(<ExpensesSection expenses={[]} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Ajouter une dépense'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  test('renders expense descriptions', () => {
    const expenses = [anExpense({ description: 'Restaurant' }), anExpense({ id: 2, description: 'Taxi' })];
    render(<ExpensesSection expenses={expenses} onAdd={jest.fn()} />);
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Taxi')).toBeInTheDocument();
  });

  test('displays total expenses', () => {
    const expenses = [anExpense({ amount: 45 }), anExpense({ id: 2, amount: 22 })];
    render(<ExpensesSection expenses={expenses} onAdd={jest.fn()} />);
    expect(screen.getByText('Total dépenses')).toBeInTheDocument();
  });

  test('sort buttons are visible', () => {
    render(<ExpensesSection expenses={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
