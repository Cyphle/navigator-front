
import { getMany, getOne } from "../helpers/http";
import { getAccount, getAccountSummaries, responseToAccount, responseToAccountSummaries } from "./account.service";

jest.mock('../helpers/http.ts', () => ({
  getMany: jest.fn(),
  getOne: jest.fn(),
}));

describe('Account service', () => {
  describe('Account summeries', () => {
    test('should get account summaries', async () => {
      (getMany as jest.Mock).mockReturnValue(Promise.resolve([{
        id: 1,
        name: 'My Account',
        type: 'PERSONAL',
        startingBalance: 100.0,
        currentBalance: 100.0,
        projectedBalance: 100.0
      }]));

      const accountSummaries = await getAccountSummaries();

      expect(accountSummaries).toEqual([{
        id: 1,
        name: 'My Account',
        type: 'PERSONAL',
        startingBalance: 100.0,
        currentBalance: 100.0,
        projectedBalance: 100.0
      }]);
    });

      test('should map response to account summaries', () => {
        const response = [{
          id: 1,
          summary: {
            id: 1,
            name: 'My Account',
            type: 'PERSONAL',
            startingBalance: 100.0,
            currentBalance: 100.0,
            projectedBalance: 100.0
          },
          budgets: [],
          transactions: []
        }];

        const accountSummaries = responseToAccountSummaries(response);

        expect(accountSummaries).toEqual([{
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
          projectedBalance: 100.0,
          period: undefined
        }]);
      });
  });

  describe('Account', () => {
    test('should get an account', async () => {
      (getOne as jest.Mock).mockReturnValue(Promise.resolve({
        summary: {
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
          projectedBalance: 100.0
        },
        budgets: [],
        transactions: []
      }));

      const account = await getAccount(1);

      expect(account).toEqual({
        summary: {
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
          projectedBalance: 100.0
        },
        budgets: [],
        transactions: []
      });
    });

    test('should map response to account', () => {
      const response = {
        id: 1,
        summary: {
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
        },
        budgets: [
          {
            id: 1,
            initialAmount: 100.0,
            actualAmount: 100.0,
            name: 'My Budget',
            startDate: '2021-01-01',
            endDate: '2021-01-31',
            frequency: 'WEEKLY'
          }
        ],
        transactions: [
          {
            id: 1,
            executedAt: '2021-01-01',
            appliedAt: '2021-01-01',
            type: 'BUDGET',
            description: 'My Transaction',
            amount: 100.0,
            startDate: '2021-01-01',
            endDate: '2021-01-31',
            budgetId: 1
          },
          {
            id: 2,
            executedAt: '2021-01-02',
            appliedAt: '2021-01-02',
            type: 'EXPENSE',
            description: 'My Transaction',
            amount: 100.0,
            startDate: '2021-01-01',
            endDate: '2021-01-31',
          }
        ]
      };

      const account = responseToAccount(response);

      expect(account).toEqual({
        id: 1,
        summary: {
          id: 1,
          name: 'My Account',
          type: 'PERSONAL',
          startingBalance: 100.0,
          currentBalance: 100.0,
          period: undefined,
          projectedBalance: undefined
        },
        budgets: [
          {
            id: 1,
            initialAmount: 100.0,
            actualAmount: 100.0,
            name: 'My Budget',
            startDate: '2021-01-01',
            endDate: '2021-01-31',
            frequency: 'WEEKLY'
          }
        ],
        transactions: [
          {
            id: 1,
            executedAt: '2021-01-01',
            appliedAt: '2021-01-01',
            type: 'BUDGET',
            description: 'My Transaction',
            amount: 100.0,
            startDate: '2021-01-01',
            endDate: '2021-01-31',
            budgetId: 1
          },
          {
            id: 2,
            executedAt: '2021-01-02',
            appliedAt: '2021-01-02',
            type: 'EXPENSE',
            description: 'My Transaction',
            amount: 100.0,
            startDate: '2021-01-01',
            endDate: '2021-01-31',
            budgetId: undefined
          }
        ],
        parameters: undefined
      });
    });
  });
});
