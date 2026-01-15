import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Option } from '../../helpers/option';
import { getUserInfo } from '../../services/user.service';
import { UserInfo } from './user.types';

export const useUserInfo = (): UseQueryResult<Option<UserInfo>, Error> => {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: getUserInfo
  });
}
