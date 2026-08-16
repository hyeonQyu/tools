import { getDaisoShoppingItemsQueryOptions, getDaisoShoppingSettingsQueryOptions } from '@/features/daiso-shopping/queries';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

export const useDaisoShoppingItems = () => {
  const reset = useDaisoShoppingStore((s) => s.reset);

  const { data: items } = useSuspenseQuery(getDaisoShoppingItemsQueryOptions());
  const { data: settings } = useSuspenseQuery(getDaisoShoppingSettingsQueryOptions());

  useLayoutEffect(() => {
    // reset()은 넘기지 않은 필드를 초기값으로 되돌린다.
    // sortBy는 사용자가 고른 화면 상태이므로 서버 데이터가 갱신돼도 그대로 유지한다.
    reset({ items, settings, sortBy: useDaisoShoppingStore.getState().sortBy });
  }, [items, settings, reset]);
};
