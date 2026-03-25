import { renderWithRouter, screen, fireEvent } from '../../../../test-utils';
import { BankAccountsSection } from './BankAccountsSection';
import type { BankAccountSummaryItem } from '../../../stores/bank-accounts/bank-accounts.types';

const anAccountSummary = (overrides: Partial<BankAccountSummaryItem> = {}): BankAccountSummaryItem => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Compte courant',
  visibility: overrides.visibility ?? 'SHARED',
  actualAmount: overrides.actualAmount ?? 2485,
  endOfMonthForecast: overrides.endOfMonthForecast ?? 2110,
});

describe('BankAccountsSection', () => {
  test('renders the section title', () => {
    renderWithRouter(<BankAccountsSection accounts={[]} />);
    expect(screen.getByText('Comptes bancaires')).toBeInTheDocument();
  });

  test('shows empty state when no accounts', () => {
    renderWithRouter(<BankAccountsSection accounts={[]} />);
    expect(screen.getByText('Aucun compte bancaire')).toBeInTheDocument();
  });

  test('renders account names', () => {
    const accounts = [
      anAccountSummary({ name: 'Compte courant' }),
      anAccountSummary({ id: 2, name: 'Livret A' }),
    ];
    renderWithRouter(<BankAccountsSection accounts={accounts} />);
    expect(screen.getByText('Compte courant')).toBeInTheDocument();
    expect(screen.getByText('Livret A')).toBeInTheDocument();
  });

  test('displays actual amount for each account', () => {
    renderWithRouter(<BankAccountsSection accounts={[anAccountSummary({ actualAmount: 2485 })]} />);
    expect(screen.getByText('2 485,00 €')).toBeInTheDocument();
  });

  test('displays end of month forecast for each account', () => {
    renderWithRouter(<BankAccountsSection accounts={[anAccountSummary({ endOfMonthForecast: 2110 })]} />);
    expect(screen.getByText('2 110,00 €')).toBeInTheDocument();
  });

  test('shows "Partagé" badge for SHARED accounts', () => {
    renderWithRouter(<BankAccountsSection accounts={[anAccountSummary({ visibility: 'SHARED' })]} />);
    expect(screen.getByText('Partagé')).toBeInTheDocument();
  });

  test('shows "Personnel" badge for PERSONAL accounts', () => {
    renderWithRouter(<BankAccountsSection accounts={[anAccountSummary({ visibility: 'PERSONAL' })]} />);
    expect(screen.getByText('Personnel')).toBeInTheDocument();
  });

  test('"Gérer les comptes" button is present', () => {
    renderWithRouter(<BankAccountsSection accounts={[]} />);
    expect(screen.getByText('Gérer les comptes')).toBeInTheDocument();
  });
});
