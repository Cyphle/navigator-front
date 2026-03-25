import { render, screen, fireEvent } from '../../../../test-utils';
import { BankAccountDetailContent } from './BankAccountDetailContent';
import { aBankAccountMonthView, aBudgetMonthView } from '../../../../test-utils/factories';

const defaultProps = {
  account: aBankAccountMonthView(),
  onAddBudget: jest.fn(),
  onAddBudgetExpense: jest.fn(),
  onAddCharge: jest.fn(),
  onAddCredit: jest.fn(),
  onAddExpense: jest.fn(),
  isPendingBudget: false,
  isPendingBudgetExpense: false,
  isPendingCharge: false,
  isPendingCredit: false,
  isPendingExpense: false,
};

describe('BankAccountDetailContent', () => {
  test('displays the three summary cards with correct amounts', () => {
    const account = aBankAccountMonthView({
      startingAmount: 2000,
      remainingAmount: 800,
      actualAmount: 650,
    });
    render(<BankAccountDetailContent {...defaultProps} account={account} />);

    expect(screen.getByText('Montant initial')).toBeInTheDocument();
    expect(screen.getByText('Montant restant')).toBeInTheDocument();
    expect(screen.getByText('Montant actuel')).toBeInTheDocument();
    expect(screen.getByText('2 000,00 €')).toBeInTheDocument();
    expect(screen.getByText('800,00 €')).toBeInTheDocument();
    expect(screen.getByText('650,00 €')).toBeInTheDocument();
  });

  test('clicking "Ajouter un budget" opens the add budget dialog', () => {
    render(<BankAccountDetailContent {...defaultProps} />);
    fireEvent.click(screen.getByText('Ajouter un budget'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('renders all tab triggers', () => {
    render(<BankAccountDetailContent {...defaultProps} />);
    expect(screen.getByRole('tab', { name: 'Budgets' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Charges' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Crédits' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Dépenses' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Transactions' })).toBeInTheDocument();
  });

  test('renders budgets from account', () => {
    const account = aBankAccountMonthView({
      budgets: [aBudgetMonthView({ name: 'Alimentation', initialAmount: 400, currentAmount: 300 })],
    });
    render(<BankAccountDetailContent {...defaultProps} account={account} />);
    expect(screen.getByText('Alimentation')).toBeInTheDocument();
  });
});
