import { render, screen, fireEvent } from '../../../../test-utils';
import { CreditsSection } from './CreditsSection';
import type { Credit } from '../../../stores/bank-accounts/bank-accounts.types';

const aCredit = (overrides: Partial<Credit> = {}): Credit => ({
  id: overrides.id ?? 1,
  description: overrides.description ?? 'Salaire',
  amount: overrides.amount ?? 2500,
  creditDate: overrides.creditDate ?? '2026-03-28',
});

describe('CreditsSection', () => {
  test('shows empty state when no credits', () => {
    render(<CreditsSection credits={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Aucun crédit défini')).toBeInTheDocument();
  });

  test('clicking "Ajouter un crédit" calls onAdd', () => {
    const onAdd = jest.fn();
    render(<CreditsSection credits={[]} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Ajouter un crédit'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  test('renders credit descriptions', () => {
    const credits = [aCredit({ description: 'Salaire' }), aCredit({ id: 2, description: 'Remboursement' })];
    render(<CreditsSection credits={credits} onAdd={jest.fn()} />);
    expect(screen.getByText('Salaire')).toBeInTheDocument();
    expect(screen.getByText('Remboursement')).toBeInTheDocument();
  });

  test('displays total credits', () => {
    const credits = [aCredit({ amount: 2500 }), aCredit({ id: 2, amount: 150 })];
    render(<CreditsSection credits={credits} onAdd={jest.fn()} />);
    expect(screen.getByText('Total crédits')).toBeInTheDocument();
  });

  test('sort buttons are visible', () => {
    render(<CreditsSection credits={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
