import { getBelongingsItemsQueryOptions, getBelongingsSettingsQueryOptions } from '@/features/belongings/queries';
import { useBelongingStore } from '@/features/belongings/stores';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

export const useBelongingsItems = () => {
  const reset = useBelongingStore((s) => s.reset);

  const { data: items } = useSuspenseQuery(getBelongingsItemsQueryOptions());
  const { data: settings } = useSuspenseQuery(getBelongingsSettingsQueryOptions());

  useLayoutEffect(() => {
    reset({ items, settings });
  }, [items, settings, reset]);
};
