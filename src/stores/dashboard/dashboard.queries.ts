import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDashboard } from '../../services/dashboard.service.ts';
import { DashboardData } from './dashboard.types.ts';

export const useFetchDashboard = (): UseQueryResult<DashboardData, Error> => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard
  });
}
