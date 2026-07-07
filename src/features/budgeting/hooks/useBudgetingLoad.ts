import { getBudgetingLoadQueryOptions } from '@/features/budgeting/queries';
import { useBudgetingConfigStore } from '@/features/budgeting/stores';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export const useBudgetingLoad = () => {
  const isLoadedRef = useRef(false);

  const { data } = useSuspenseQuery(getBudgetingLoadQueryOptions());

  const resetConfig = useBudgetingConfigStore((store) => store.reset);

  useEffect(() => {
    if (isLoadedRef.current || !data) return;

    isLoadedRef.current = true;

    resetConfig(data.config);
  }, [data, resetConfig]);
};
