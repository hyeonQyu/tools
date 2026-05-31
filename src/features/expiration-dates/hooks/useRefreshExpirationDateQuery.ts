import { getExpirationDateItemsQueryOptions, getExpirationDateSettingsQueryOptions } from '@/features/expiration-dates/queries';
import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshExpirationDateQuery = () => {
  const queryClient = useQueryClient();
  const reset = useExpirationDateStore((s) => s.reset);

  return async () => {
    const [items, settings] = await Promise.all([
      queryClient.fetchQuery(getExpirationDateItemsQueryOptions()),
      queryClient.fetchQuery(getExpirationDateSettingsQueryOptions()),
    ]);
    reset({ items, settings });
  };
};
