import { render, screen, fireEvent } from '../../../../test-utils';
import { ChargesSection } from './ChargesSection';
import type { Charge } from '../../../stores/bank-accounts/bank-accounts.types';

const aCharge = (overrides: Partial<Charge> = {}): Charge => ({
  id: overrides.id ?? 1,
  description: overrides.description ?? 'Loyer',
  amount: overrides.amount ?? 900,
  debitDate: overrides.debitDate ?? '2026-03-01',
  periodicity: overrides.periodicity ?? 'MONTHLY',
});

describe('ChargesSection', () => {
  test('shows empty state when no charges', () => {
    render(<ChargesSection charges={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Aucune charge définie')).toBeInTheDocument();
  });

  test('clicking "Ajouter une charge" calls onAdd', () => {
    const onAdd = jest.fn();
    render(<ChargesSection charges={[]} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Ajouter une charge'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  test('renders charge descriptions', () => {
    const charges = [aCharge({ description: 'Loyer' }), aCharge({ id: 2, description: 'Internet' })];
    render(<ChargesSection charges={charges} onAdd={jest.fn()} />);
    expect(screen.getByText('Loyer')).toBeInTheDocument();
    expect(screen.getByText('Internet')).toBeInTheDocument();
  });

  test('displays total charges', () => {
    const charges = [aCharge({ amount: 900 }), aCharge({ id: 2, amount: 40 })];
    render(<ChargesSection charges={charges} onAdd={jest.fn()} />);
    expect(screen.getByText('Total charges')).toBeInTheDocument();
  });

  test('shows "Mensuelle" badge for MONTHLY charges', () => {
    render(<ChargesSection charges={[aCharge({ periodicity: 'MONTHLY' })]} onAdd={jest.fn()} />);
    expect(screen.getByText('Mensuelle')).toBeInTheDocument();
  });

  test('shows "Annuelle" badge for YEARLY charges', () => {
    render(<ChargesSection charges={[aCharge({ periodicity: 'YEARLY' })]} onAdd={jest.fn()} />);
    expect(screen.getByText('Annuelle')).toBeInTheDocument();
  });

  test('sort buttons are visible', () => {
    render(<ChargesSection charges={[]} onAdd={jest.fn()} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
