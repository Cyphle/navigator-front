import { render, screen, fireEvent } from '../../../../test-utils';
import { BankAccountsView } from './BankAccountsView';
import type { BankAccount } from '../../../stores/bank-accounts/bank-accounts.types';

const anAccount = (overrides: Partial<BankAccount> = {}): BankAccount => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Compte courant',
  startingAmount: overrides.startingAmount ?? 1000,
  startDate: overrides.startDate ?? '2026-01-01',
  visibility: overrides.visibility ?? 'PERSONAL',
  budgets: overrides.budgets ?? [],
  charges: overrides.charges ?? [],
  credits: overrides.credits ?? [],
  expenses: overrides.expenses ?? [],
});

describe('BankAccountsView', () => {
  test('renders the create button', () => {
    const onCreate = jest.fn();
    render(<BankAccountsView accounts={[]} onSelect={jest.fn()} onCreate={onCreate} />);
    expect(screen.getByText('Ajouter un compte')).toBeInTheDocument();
  });

  test('clicking "Ajouter un compte" calls onCreate', () => {
    const onCreate = jest.fn();
    render(<BankAccountsView accounts={[]} onSelect={jest.fn()} onCreate={onCreate} />);
    fireEvent.click(screen.getByText('Ajouter un compte'));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  test('shows empty state when no accounts', () => {
    render(<BankAccountsView accounts={[]} onSelect={jest.fn()} onCreate={jest.fn()} />);
    expect(screen.getByText('Aucun compte bancaire')).toBeInTheDocument();
    expect(screen.getByText('Créer mon premier compte')).toBeInTheDocument();
  });

  test('clicking "Créer mon premier compte" calls onCreate', () => {
    const onCreate = jest.fn();
    render(<BankAccountsView accounts={[]} onSelect={jest.fn()} onCreate={onCreate} />);
    fireEvent.click(screen.getByText('Créer mon premier compte'));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  test('renders account cards when accounts are provided', () => {
    const accounts = [anAccount({ name: 'Compte épargne' }), anAccount({ id: 2, name: 'Livret A' })];
    render(<BankAccountsView accounts={accounts} onSelect={jest.fn()} onCreate={jest.fn()} />);
    expect(screen.getByText('Compte épargne')).toBeInTheDocument();
    expect(screen.getByText('Livret A')).toBeInTheDocument();
  });

  test('clicking an account card calls onSelect with the account id', () => {
    const onSelect = jest.fn();
    const accounts = [anAccount({ id: 42, name: 'Mon compte' })];
    render(<BankAccountsView accounts={accounts} onSelect={onSelect} onCreate={jest.fn()} />);
    fireEvent.click(screen.getByText('Mon compte'));
    expect(onSelect).toHaveBeenCalledWith(42);
  });
});
