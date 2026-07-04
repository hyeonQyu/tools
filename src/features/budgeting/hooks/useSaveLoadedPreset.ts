import { budgetingPresetService } from '@/features/budgeting/data';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { useCallback } from 'react';

export const useSaveLoadedPreset = () => {
  return useCallback(async () => {
    const { loadedPresetId, getState } = useBudgetingStore.getState();
    if (!loadedPresetId) return;

    await budgetingPresetService.update(loadedPresetId, getState());
  }, []);
};
