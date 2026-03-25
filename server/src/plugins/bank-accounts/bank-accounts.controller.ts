import type { FastifyPluginAsync } from 'fastify';
import {
  getAllBankAccounts,
  getBankAccountByIdForMonth,
  createBankAccount,
  addBudget,
  addBudgetExpense,
  addCharge,
  addCredit,
  addExpense,
} from './bank-accounts.handlers';
import type {
  CreateBankAccountInput,
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from './bank-accounts.types';

export const bankAccountsController: FastifyPluginAsync = async (fastify) => {
  // GET /:familyId/bank-accounts
  fastify.get<{ Params: { familyId: string } }>('/:familyId/bank-accounts', async (request, reply) => {
    const familyId = parseInt(request.params.familyId, 10);
    const accounts = getAllBankAccounts(familyId);
    return reply.code(200).send(accounts);
  });

  // POST /:familyId/bank-accounts
  fastify.post<{ Params: { familyId: string }; Body: CreateBankAccountInput }>(
    '/:familyId/bank-accounts',
    async (request, reply) => {
      const familyId = parseInt(request.params.familyId, 10);
      const newAccount = createBankAccount(familyId, request.body);
      return reply.code(201).send(newAccount);
    }
  );

  // GET /:familyId/bank-accounts/:id
  fastify.get<{ Params: { familyId: string; id: string }; Querystring: { year?: string; month?: string } }>(
    '/:familyId/bank-accounts/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const now = new Date();
      const year = request.query.year ? parseInt(request.query.year, 10) : now.getFullYear();
      const month = request.query.month ? parseInt(request.query.month, 10) : now.getMonth() + 1;
      const account = getBankAccountByIdForMonth(id, year, month);

      if (!account) {
        return reply.code(404).send({ error: 'Bank account not found' });
      }

      return reply.code(200).send(account);
    }
  );

  // POST /:familyId/bank-accounts/:id/budgets
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateBudgetInput }>(
    '/:familyId/bank-accounts/:id/budgets',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedAccount = addBudget(id, request.body);

      if (!updatedAccount) {
        return reply.code(404).send({ error: 'Bank account not found' });
      }

      return reply.code(200).send(updatedAccount);
    }
  );

  // POST /:familyId/bank-accounts/:id/budgets/:budgetId/expenses
  fastify.post<{ Params: { familyId: string; id: string; budgetId: string }; Body: CreateBudgetExpenseInput }>(
    '/:familyId/bank-accounts/:id/budgets/:budgetId/expenses',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const budgetId = parseInt(request.params.budgetId, 10);
      const updatedAccount = addBudgetExpense(id, budgetId, request.body);

      if (!updatedAccount) {
        return reply.code(404).send({ error: 'Bank account or budget not found' });
      }

      return reply.code(200).send(updatedAccount);
    }
  );

  // POST /:familyId/bank-accounts/:id/charges
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateChargeInput }>(
    '/:familyId/bank-accounts/:id/charges',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedAccount = addCharge(id, request.body);

      if (!updatedAccount) {
        return reply.code(404).send({ error: 'Bank account not found' });
      }

      return reply.code(200).send(updatedAccount);
    }
  );

  // POST /:familyId/bank-accounts/:id/credits
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateCreditInput }>(
    '/:familyId/bank-accounts/:id/credits',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedAccount = addCredit(id, request.body);

      if (!updatedAccount) {
        return reply.code(404).send({ error: 'Bank account not found' });
      }

      return reply.code(200).send(updatedAccount);
    }
  );

  // POST /:familyId/bank-accounts/:id/expenses
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateExpenseInput }>(
    '/:familyId/bank-accounts/:id/expenses',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedAccount = addExpense(id, request.body);

      if (!updatedAccount) {
        return reply.code(404).send({ error: 'Bank account not found' });
      }

      return reply.code(200).send(updatedAccount);
    }
  );
};
