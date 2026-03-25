import { render, screen, fireEvent } from '../../../../test-utils';
import { BankAccountCard } from './BankAccountCard';
import type { BankAccount } from '../../../stores/bank-accounts/bank-accounts.types';

const anAccount = (overrides: Partial<BankAccount> = {}): BankAccount => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Compte courant',
  startingAmount: overrides.startingAmount ?? 1500,
  startDate: overrides.startDate ?? '2026-01-01',
  visibility: overrides.visibility ?? 'PERSONAL',
  budgets: [],
  charges: [],
  credits: [],
  expenses: [],
});

describe('BankAccountCard', () => {
  test('displays the account name', () => {
    render(<BankAccountCard account={anAccount({ name: 'Mon épargne' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Mon épargne')).toBeInTheDocument();
  });

  test('displays the starting amount', () => {
    render(<BankAccountCard account={anAccount({ startingAmount: 2000 })} onSelect={jest.fn()} />);
    expect(screen.getByText('2 000,00 €')).toBeInTheDocument();
  });

  test('displays the start date', () => {
    render(<BankAccountCard account={anAccount({ startDate: '2026-03-01' })} onSelect={jest.fn()} />);
    expect(screen.getByText('2026-03-01')).toBeInTheDocument();
  });

  test('displays "Personnel" badge for PERSONAL visibility', () => {
    render(<BankAccountCard account={anAccount({ visibility: 'PERSONAL' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Personnel')).toBeInTheDocument();
  });

  test('displays "Partagé" badge for SHARED visibility', () => {
    render(<BankAccountCard account={anAccount({ visibility: 'SHARED' })} onSelect={jest.fn()} />);
    expect(screen.getByText('Partagé')).toBeInTheDocument();
  });

  test('clicking the card calls onSelect', () => {
    const onSelect = jest.fn();
    render(<BankAccountCard account={anAccount()} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('article'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
