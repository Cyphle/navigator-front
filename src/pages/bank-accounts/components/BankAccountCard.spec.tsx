import { render, screen, fireEvent } from '../../../../test-utils';
import { BankAccountCard } from './BankAccountCard';
import type { BankAccountOverviewItem } from '../../../stores/bank-accounts/bank-accounts.types';

const anAccount = (overrides: Partial<BankAccountOverviewItem> = {}): BankAccountOverviewItem => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Compte courant',
  visibility: overrides.visibility ?? 'PERSONAL',
  startingAmount: overrides.startingAmount ?? 1500,
  actualAmount: overrides.actualAmount ?? 1200,
  remainingAmount: overrides.remainingAmount ?? 900,
  totalCredits: overrides.totalCredits ?? 2500,
  totalExpenses: overrides.totalExpenses ?? 67,
  budgets: overrides.budgets ?? [],
});

describe('BankAccountCard', () => {
  test('displays the account name', () => {
    render(<BankAccountCard account={anAccount({ name: 'Mon épargne' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Mon épargne')).toBeInTheDocument();
  });

  test('displays the actual amount', () => {
    render(<BankAccountCard account={anAccount({ actualAmount: 1200 })} onSelect={jest.fn()} />);
    expect(screen.getByText('1 200,00 €')).toBeInTheDocument();
  });

  test('displays the remaining amount', () => {
    render(<BankAccountCard account={anAccount({ remainingAmount: 900 })} onSelect={jest.fn()} />);
    expect(screen.getByText('900,00 €')).toBeInTheDocument();
  });

  test('displays "Personnel" badge for PERSONAL visibility', () => {
    render(<BankAccountCard account={anAccount({ visibility: 'PERSONAL' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Personnel')).toBeInTheDocument();
  });

  test('displays "Partagé" badge for SHARED visibility', () => {
    render(<BankAccountCard account={anAccount({ visibility: 'SHARED' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Partagé')).toBeInTheDocument();
  });

  test('displays budget names and remaining amounts', () => {
    const account = anAccount({
      budgets: [
        { id: 1, name: 'Alimentation', initialAmount: 400, remainingAmount: 270 },
      ],
    });
    render(<BankAccountCard account={account} onSelect={jest.fn()} />);
    expect(screen.getByText('Alimentation')).toBeInTheDocument();
    expect(screen.getByText('270,00 €')).toBeInTheDocument();
  });

  test('clicking the card calls onSelect', () => {
    const onSelect = jest.fn();
    render(<BankAccountCard account={anAccount()} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('article'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
