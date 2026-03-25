import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateBankAccountInput,
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from './bank-accounts.types';
import * as bankAccountsService from '../../services/bank-accounts.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'bank-accounts';

export const useFetchAllBankAccounts = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => bankAccountsService.getAllBankAccounts(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchBankAccountById = (id: number, year: number, month: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id, year, month],
    queryFn: () => bankAccountsService.getBankAccountById(currentFamily?.id ?? '', id, year, month),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreateBankAccountInput) =>
      bankAccountsService.createBankAccount(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddBudget = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ accountId, input }: { accountId: number; input: CreateBudgetInput }) =>
      bankAccountsService.addBudget(currentFamily?.id ?? '', accountId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddBudgetExpense = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({
      accountId,
      budgetId,
      input,
    }: {
      accountId: number;
      budgetId: number;
      input: CreateBudgetExpenseInput;
    }) => bankAccountsService.addBudgetExpense(currentFamily?.id ?? '', accountId, budgetId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddCharge = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ accountId, input }: { accountId: number; input: CreateChargeInput }) =>
      bankAccountsService.addCharge(currentFamily?.id ?? '', accountId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddCredit = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ accountId, input }: { accountId: number; input: CreateCreditInput }) =>
      bankAccountsService.addCredit(currentFamily?.id ?? '', accountId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ accountId, input }: { accountId: number; input: CreateExpenseInput }) =>
      bankAccountsService.addExpense(currentFamily?.id ?? '', accountId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
