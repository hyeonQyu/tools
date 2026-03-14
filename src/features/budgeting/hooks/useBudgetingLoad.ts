import { getBudgetingLoadQueryOptions } from '@/features/budgeting/queries';
import { useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export const useBudgetingLoad = () => {
  const isLoadedRef = useRef(false);

  const { data } = useSuspenseQuery(getBudgetingLoadQueryOptions());

  const resetForm = useBudgetingStore((store) => store.reset);
  const resetConfig = useBudgetingConfigStore((store) => store.reset);

  useEffect(() => {
    if (isLoadedRef.current || !data) return;

    isLoadedRef.current = true;

    resetForm(data.form);
    resetConfig(data.config);
  }, [data, resetForm, resetConfig]);
};
