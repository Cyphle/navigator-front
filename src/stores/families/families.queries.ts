import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFamilies } from '../../services/families.service';
import type { Family } from './families.types';

export const useFetchFamilies = (): UseQueryResult<Family[], Error> => {
  return useQuery({
    queryKey: ['families'],
    queryFn: getFamilies
  });
};
