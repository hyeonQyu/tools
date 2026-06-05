import { getBelongingsItemsQueryOptions, getBelongingsSettingsQueryOptions } from '@/features/belongings/queries';
import { useBelongingStore } from '@/features/belongings/stores';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshBelongingsQuery = () => {
  const queryClient = useQueryClient();
  const reset = useBelongingStore((s) => s.reset);

  return async () => {
    const [items, settings] = await Promise.all([
      queryClient.fetchQuery(getBelongingsItemsQueryOptions()),
      queryClient.fetchQuery(getBelongingsSettingsQueryOptions()),
    ]);
    reset({ items, settings });
  };
};
