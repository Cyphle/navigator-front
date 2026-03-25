import {
  getAllBankAccounts,
  getBankAccountById,
  getBankAccountByIdForMonth,
  createBankAccount,
  addBudget,
  addBudgetExpense,
  addCharge,
  addCredit,
  addExpense,
} from './bank-accounts.handlers';

describe('bank-accounts handlers', () => {
  describe('getAllBankAccounts', () => {
    test('returns accounts for the given familyId', () => {
      const accounts = getAllBankAccounts(1);
      expect(accounts.length).toBeGreaterThanOrEqual(1);
      expect(accounts.every((a) => a.familyId === 1)).toBe(true);
    });

    test('returns empty array for unknown familyId', () => {
      const accounts = getAllBankAccounts(99999);
      expect(accounts).toEqual([]);
    });
  });

  describe('getBankAccountById', () => {
    test('returns the account for a valid id', () => {
      const account = getBankAccountById(1);
      expect(account).toBeDefined();
      expect(account?.id).toBe(1);
      expect(account?.name).toBe('Compte courant');
    });

    test('returns undefined for an unknown id', () => {
      const account = getBankAccountById(99999);
      expect(account).toBeUndefined();
    });
  });

  describe('getBankAccountByIdForMonth', () => {
    test('returns undefined for an unknown account id', () => {
      const result = getBankAccountByIdForMonth(99999, 2026, 3);
      expect(result).toBeUndefined();
    });

    test('returns correct monthLabel', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      expect(result?.monthLabel).toBe('Mars 2026');
    });

    test('returns correct monthLabel for January', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 1);
      expect(result?.monthLabel).toBe('Janvier 2026');
    });

    test('includes only credits for the requested month', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      // Mock data has 2 credits in 2026-03
      expect(result?.credits).toHaveLength(2);
      expect(result?.credits.every((c) => c.creditDate.startsWith('2026-03'))).toBe(true);
    });

    test('includes only free expenses for the requested month', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      // Mock data has 2 expenses in 2026-03
      expect(result?.expenses).toHaveLength(2);
      expect(result?.expenses.every((e) => e.expenseDate.startsWith('2026-03'))).toBe(true);
    });

    test('always includes MONTHLY charges', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      const monthlyCharges = result?.charges.filter((c) => c.periodicity === 'MONTHLY');
      expect(monthlyCharges?.length).toBeGreaterThanOrEqual(2);
    });

    test('includes YEARLY charges only when their debitDate matches the month', () => {
      const resultJanuary = getBankAccountByIdForMonth(1, 2026, 1);
      const resultMarch = getBankAccountByIdForMonth(1, 2026, 3);

      const yearlyInJanuary = resultJanuary?.charges.filter((c) => c.periodicity === 'YEARLY') ?? [];
      const yearlyInMarch = resultMarch?.charges.filter((c) => c.periodicity === 'YEARLY') ?? [];

      // Assurance voiture debitDate is 2026-01-15 → present in January, absent in March
      expect(yearlyInJanuary.length).toBeGreaterThanOrEqual(1);
      expect(yearlyInMarch.length).toBe(0);
    });

    test('computes budget currentAmount by subtracting month expenses', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      const alimentation = result?.budgets.find((b) => b.name === 'Alimentation');
      expect(alimentation).toBeDefined();
      // initialAmount=400, expenses in 2026-03: 85 + 45 = 130 → currentAmount = 270
      expect(alimentation?.initialAmount).toBe(400);
      expect(alimentation?.currentAmount).toBe(270);
    });

    test('computes remainingAmount correctly', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      // startingAmount=1000, creditsSum=2650, budgetsInitialSum=600, chargesSum=940
      // remainingAmount = 1000 + 2650 - 600 - 940 = 2110
      expect(result?.remainingAmount).toBe(2110);
    });

    test('computes actualAmount correctly', () => {
      const result = getBankAccountByIdForMonth(1, 2026, 3);
      // startingAmount=1000, creditsSum=2650, budgetsInitialSum=600, budgetsCurrentSum=442
      // chargesSum=940, expensesSum=67
      // actualAmount = 1000 + 2650 - (600 - 442) - 940 - 67 = 2485
      expect(result?.actualAmount).toBe(2485);
    });

    test('returns empty arrays when no data for a future month', () => {
      const result = getBankAccountByIdForMonth(1, 2030, 6);
      expect(result?.credits).toHaveLength(0);
      expect(result?.expenses).toHaveLength(0);
    });
  });

  describe('createBankAccount', () => {
    test('creates a bank account with correct fields', () => {
      const created = createBankAccount(1, {
        name: 'Épargne',
        startingAmount: 5000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      expect(created.id).toBeGreaterThan(0);
      expect(created.name).toBe('Épargne');
      expect(created.startingAmount).toBe(5000);
      expect(created.visibility).toBe('PERSONAL');
      expect(created.budgets).toEqual([]);
      expect(created.charges).toEqual([]);
      expect(created.credits).toEqual([]);
      expect(created.expenses).toEqual([]);
    });

    test('created account is returned by getAllBankAccounts', () => {
      const created = createBankAccount(1, {
        name: 'Livret A',
        startingAmount: 2000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      const all = getAllBankAccounts(1);
      expect(all.some((a) => a.id === created.id)).toBe(true);
    });
  });

  describe('addBudget', () => {
    test('adds a budget to an existing account', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      const updated = addBudget(account.id, { name: 'Alimentation', initialAmount: 300 });

      expect(updated).toBeDefined();
      expect(updated?.budgets).toHaveLength(1);
      expect(updated?.budgets[0].name).toBe('Alimentation');
      expect(updated?.budgets[0].initialAmount).toBe(300);
      expect(updated?.budgets[0].expenses).toEqual([]);
    });

    test('returns undefined for unknown account', () => {
      const result = addBudget(99999, { name: 'Test', initialAmount: 100 });
      expect(result).toBeUndefined();
    });
  });

  describe('addBudgetExpense', () => {
    test('adds an expense to a budget', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });
      addBudget(account.id, { name: 'Courses', initialAmount: 200 });
      const updatedAccount = getBankAccountById(account.id)!;
      const budgetId = updatedAccount.budgets[0].id;

      const result = addBudgetExpense(account.id, budgetId, {
        description: 'Supermarché',
        amount: 50,
        expenseDate: '2026-03-10',
        debitDate: '2026-03-11',
      });

      expect(result).toBeDefined();
      const budget = result?.budgets.find((b) => b.id === budgetId);
      expect(budget?.expenses).toHaveLength(1);
      expect(budget?.expenses[0].description).toBe('Supermarché');
    });

    test('returns undefined for unknown account', () => {
      const result = addBudgetExpense(99999, 1, {
        description: 'Test',
        amount: 10,
        expenseDate: '2026-03-01',
        debitDate: '2026-03-02',
      });
      expect(result).toBeUndefined();
    });

    test('returns undefined for unknown budget', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });
      const result = addBudgetExpense(account.id, 99999, {
        description: 'Test',
        amount: 10,
        expenseDate: '2026-03-01',
        debitDate: '2026-03-02',
      });
      expect(result).toBeUndefined();
    });
  });

  describe('addCharge', () => {
    test('adds a charge to an existing account', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      const updated = addCharge(account.id, {
        description: 'Loyer',
        amount: 800,
        debitDate: '2026-03-01',
        periodicity: 'MONTHLY',
      });

      expect(updated).toBeDefined();
      const addedCharge = updated?.charges.find((c) => c.description === 'Loyer');
      expect(addedCharge?.amount).toBe(800);
      expect(addedCharge?.periodicity).toBe('MONTHLY');
    });

    test('returns undefined for unknown account', () => {
      const result = addCharge(99999, {
        description: 'Test',
        amount: 100,
        debitDate: '2026-03-01',
        periodicity: 'MONTHLY',
      });
      expect(result).toBeUndefined();
    });
  });

  describe('addCredit', () => {
    test('adds a credit to an existing account', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      const updated = addCredit(account.id, {
        description: 'Salaire',
        amount: 2500,
        creditDate: '2026-03-28',
      });

      expect(updated).toBeDefined();
      const addedCredit = updated?.credits.find((c) => c.description === 'Salaire');
      expect(addedCredit?.amount).toBe(2500);
    });

    test('returns undefined for unknown account', () => {
      const result = addCredit(99999, { description: 'Test', amount: 100, creditDate: '2026-03-01' });
      expect(result).toBeUndefined();
    });
  });

  describe('addExpense', () => {
    test('adds a free expense to an existing account', () => {
      const account = createBankAccount(1, {
        name: 'Test',
        startingAmount: 1000,
        startDate: '2026-01-01',
        visibility: 'PERSONAL',
      });

      const updated = addExpense(account.id, {
        description: 'Restaurant',
        amount: 45,
        expenseDate: '2026-03-15',
        debitDate: '2026-03-16',
      });

      expect(updated).toBeDefined();
      const addedExpense = updated?.expenses.find((e) => e.description === 'Restaurant');
      expect(addedExpense?.amount).toBe(45);
    });

    test('returns undefined for unknown account', () => {
      const result = addExpense(99999, {
        description: 'Test',
        amount: 10,
        expenseDate: '2026-03-01',
        debitDate: '2026-03-02',
      });
      expect(result).toBeUndefined();
    });
  });
});
