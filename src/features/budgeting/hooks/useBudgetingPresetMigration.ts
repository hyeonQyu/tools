import { budgetingPresetService } from '@/features/budgeting/data';
import { getBudgetingLoadQueryOptions } from '@/features/budgeting/queries';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries/budgeting.query.preset';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRefreshBudgetingPresetListQuery } from './useRefreshBudgetingPresetListQuery';

let hasMigrated = false;

export const useBudgetingPresetMigration = () => {
  const refreshPresets = useRefreshBudgetingPresetListQuery();

  const { data: budgetingData } = useQuery(getBudgetingLoadQueryOptions());
  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());

  useEffect(() => {
    if (hasMigrated) return;
    if (presets === undefined) return;
    if (presets.length > 0 || !budgetingData) {
      hasMigrated = true;
      return;
    }

    hasMigrated = true;

    budgetingPresetService.save({ name: '기존', form: budgetingData.form }).then(refreshPresets).catch(console.error);
  }, [presets, budgetingData, refreshPresets]);
};
