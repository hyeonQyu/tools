import { getExpirationDateItemsQueryOptions, getExpirationDateSettingsQueryOptions } from '@/features/expiration-dates/queries';
import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

export const useExpirationDateItems = () => {
  const reset = useExpirationDateStore((s) => s.reset);

  const { data: items } = useSuspenseQuery(getExpirationDateItemsQueryOptions());
  const { data: settings } = useSuspenseQuery(getExpirationDateSettingsQueryOptions());

  useLayoutEffect(() => {
    reset({ items, settings });
  }, [items, settings, reset]);
};
