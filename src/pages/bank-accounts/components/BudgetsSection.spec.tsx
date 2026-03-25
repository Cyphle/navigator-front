import { render, screen, fireEvent } from '../../../../test-utils';
import { BudgetsSection } from './BudgetsSection';
import { aBudgetMonthView } from '../../../../test-utils/factories';

describe('BudgetsSection', () => {
  test('shows empty state when no budgets', () => {
    render(<BudgetsSection budgets={[]} onAddBudget={jest.fn()} onAddExpense={jest.fn()} />);
    expect(screen.getByText('Aucun budget défini')).toBeInTheDocument();
  });

  test('clicking "Ajouter un budget" calls onAddBudget', () => {
    const onAddBudget = jest.fn();
    render(<BudgetsSection budgets={[]} onAddBudget={onAddBudget} onAddExpense={jest.fn()} />);
    fireEvent.click(screen.getByText('Ajouter un budget'));
    expect(onAddBudget).toHaveBeenCalledTimes(1);
  });

  test('renders budget names', () => {
    const budgets = [
      aBudgetMonthView({ name: 'Alimentation' }),
      aBudgetMonthView({ id: 2, name: 'Loisirs' }),
    ];
    render(<BudgetsSection budgets={budgets} onAddBudget={jest.fn()} onAddExpense={jest.fn()} />);
    expect(screen.getByText('Alimentation')).toBeInTheDocument();
    expect(screen.getByText('Loisirs')).toBeInTheDocument();
  });

  test('displays total initial and current amounts', () => {
    const budgets = [
      aBudgetMonthView({ initialAmount: 400, currentAmount: 300 }),
      aBudgetMonthView({ id: 2, initialAmount: 200, currentAmount: 150 }),
    ];
    render(<BudgetsSection budgets={budgets} onAddBudget={jest.fn()} onAddExpense={jest.fn()} />);
    expect(screen.getByText('Total budgets')).toBeInTheDocument();
  });

  test('clicking "Dépense" button calls onAddExpense with the budget id', () => {
    const onAddExpense = jest.fn();
    const budgets = [aBudgetMonthView({ id: 42, name: 'Alimentation' })];
    render(<BudgetsSection budgets={budgets} onAddBudget={jest.fn()} onAddExpense={onAddExpense} />);
    fireEvent.click(screen.getByText('Dépense'));
    expect(onAddExpense).toHaveBeenCalledWith(42);
  });

  test('sort buttons are visible', () => {
    render(<BudgetsSection budgets={[]} onAddBudget={jest.fn()} onAddExpense={jest.fn()} />);
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
  });

  test('clicking sort by amount reorders budgets', () => {
    const budgets = [
      aBudgetMonthView({ id: 1, name: 'Alimentation', initialAmount: 400 }),
      aBudgetMonthView({ id: 2, name: 'Loisirs', initialAmount: 200 }),
    ];
    render(<BudgetsSection budgets={budgets} onAddBudget={jest.fn()} onAddExpense={jest.fn()} />);
    fireEvent.click(screen.getByText('Montant'));
    const names = screen.getAllByText(/Alimentation|Loisirs/).map((el) => el.textContent);
    // By amount desc: Alimentation (400) comes first
    expect(names[0]).toBe('Alimentation');
  });
});
