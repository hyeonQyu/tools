import { getWsServerFindAllQueryOptions } from '@/features/ws-server/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useWsServers = () => {
  const { data } = useSuspenseQuery(getWsServerFindAllQueryOptions());
  return data;
};
