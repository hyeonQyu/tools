import { useIndexedDBStore } from '@/indexed-db';
import { useMemo } from 'react';

export const useCurrentBudgetingQueryOptions = () => {
  const idbStore = useIndexedDBStore('current-budgeting');

  return useMemo(() => {
    return {
      queryKey: ['current-budgeting'],
      queryFn: () => idbStore?.get('current-budgeting'),
      enabled: Boolean(idbStore),
    };
  }, [idbStore]);
};
