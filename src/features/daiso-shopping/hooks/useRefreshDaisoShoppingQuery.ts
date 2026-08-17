import { getDaisoShoppingItemsQueryOptions, getDaisoShoppingSettingsQueryOptions } from '@/features/daiso-shopping/queries';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshDaisoShoppingQuery = () => {
  const queryClient = useQueryClient();
  const reset = useDaisoShoppingStore((s) => s.reset);

  return async () => {
    const [items, settings] = await Promise.all([
      queryClient.fetchQuery(getDaisoShoppingItemsQueryOptions()),
      queryClient.fetchQuery(getDaisoShoppingSettingsQueryOptions()),
    ]);
    // 넘기지 않은 필드는 초기값으로 돌아가므로 사용자가 고른 정렬 기준을 함께 유지한다.
    reset({ items, settings, sortBy: useDaisoShoppingStore.getState().sortBy });
  };
};
