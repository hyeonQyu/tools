import { budgetingPresetService, budgetingService } from '@/features/budgeting/data';
import { getBudgetingLoadQueryOptions, getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { BudgetingConfigStates, BudgetingStates, useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { debounce, isEqual } from 'es-toolkit';
import { useCallback, useEffect, useMemo } from 'react';

export const useBudgetingAutoSave = () => {
  const { data } = useQuery(getBudgetingLoadQueryOptions());
  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());

  const formStore = useBudgetingStore();
  const configStore = useBudgetingConfigStore();

  const getFormState = useBudgetingStore((store) => store.getState);
  const getConfigState = useBudgetingConfigStore((store) => store.getState);

  const saveUpdated = useCallback(
    async (formState: BudgetingStates, configState: BudgetingConfigStates, loadedPresetId: string | null) => {
      try {
        // 레거시 싱글턴 문서는 config의 유일한 저장소로만 남기고, form은 마이그레이션 당시 값에 고정한다.
        if (!data || !isEqual(configState, data.config)) {
          await budgetingService.save({ form: data?.form ?? formState, config: configState });
        }

        if (loadedPresetId) {
          const preset = presets?.find((p) => p.id === loadedPresetId);
          if (!preset || !isEqual(formState, preset.form)) {
            await budgetingPresetService.update(loadedPresetId, formState);
          }
        }
      } catch (error) {
        console.error('[useBudgetingAutoSave] 저장 실패:', error);
      }
    },
    [data, presets],
  );

  const debouncedSave = useMemo(() => {
    return debounce(saveUpdated, TIME_UNIT.unitOfMs.asSecond * 1.5);
  }, [saveUpdated]);

  useEffect(() => {
    debouncedSave(formStore.getState(), configStore.getState(), formStore.loadedPresetId);
  }, [debouncedSave, formStore, configStore]);

  useEffect(() => {
    return () => {
      saveUpdated(getFormState(), getConfigState(), useBudgetingStore.getState().loadedPresetId).catch((error) => {
        console.error('[useBudgetingAutoSave] 언마운트 저장 실패:', error);
      });
    };
  }, [saveUpdated, getFormState, getConfigState]);
};
