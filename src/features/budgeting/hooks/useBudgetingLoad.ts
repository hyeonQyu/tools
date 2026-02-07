import { useQueryCurrentBudgeting } from '@/features/budgeting/hooks/useQueryCurrentBudgeting';
import { useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { useEffect, useRef } from 'react';

export const useBudgetingLoad = () => {
  const isLoadedRef = useRef(false);

  const { data } = useQueryCurrentBudgeting();

  const resetForm = useBudgetingStore((store) => store.reset);
  const resetConfig = useBudgetingConfigStore((store) => store.reset);

  useEffect(() => {
    if (isLoadedRef.current || !data) return;

    isLoadedRef.current = true;

    resetForm(data.form);
    resetConfig(data.config);
  }, [data, resetForm, resetConfig]);
};
