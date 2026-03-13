import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDashboard } from '../../services/dashboard.service.ts';
import { DashboardData } from './dashboard.types.ts';
import { useFamily } from '../../contexts/family/family.context.tsx';

export const useFetchDashboard = (): UseQueryResult<DashboardData, Error> => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: ['dashboard', currentFamily?.id],
    queryFn: () => getDashboard(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
}
