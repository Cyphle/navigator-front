import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAccount, getAccountSummaries } from '../../services/account.service.ts';
import { AccountSummary } from './account.types.ts';

export const useFetchAccountSummaries = (): UseQueryResult<AccountSummary[], Error> => {
  return useQuery({
    queryKey: ['account'],
    queryFn: getAccountSummaries
  });
}

export const useFetchAccount = (id: number): UseQueryResult => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id)
  });
}