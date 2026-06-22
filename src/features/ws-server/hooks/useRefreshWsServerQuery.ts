import { getWsServerFindAllQueryOptions } from '@/features/ws-server/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshWsServerQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: getWsServerFindAllQueryOptions().queryKey });
};
