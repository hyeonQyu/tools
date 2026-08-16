import { getCgvNotificationFindAllQueryOptions, getCgvWatchFindAllQueryOptions } from '@/features/cgv-alert/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshCgvWatchQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: getCgvWatchFindAllQueryOptions().queryKey });
};

export const useRefreshCgvNotificationQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: getCgvNotificationFindAllQueryOptions().queryKey });
};
