import { budgetingService } from '@/features/budgeting/data';
import { getBudgetingLoadQueryOptions } from '@/features/budgeting/queries';
import { BudgetingConfigStates, BudgetingStates, useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { debounce, isEqual } from 'es-toolkit';
import { useCallback, useEffect, useMemo } from 'react';

export const useBudgetingAutoSave = () => {
  const { data } = useQuery(getBudgetingLoadQueryOptions());

  const formStore = useBudgetingStore();
  const configStore = useBudgetingConfigStore();

  const getFormState = useBudgetingStore((store) => store.getState);
  const getConfigState = useBudgetingConfigStore((store) => store.getState);

  const saveUpdated = useCallback(
    async (formState: BudgetingStates, configState: BudgetingConfigStates) => {
      if (!data) return;

      try {
        if (isEqual(formState, data.form) && isEqual(configState, data.config)) {
          return;
        }

        await budgetingService.save({ form: formState, config: configState });
      } catch (error) {
        console.error('[useBudgetingAutoSave] 저장 실패:', error);
      }
    },
    [data],
  );

  const debouncedSave = useMemo(() => {
    return debounce(saveUpdated, TIME_UNIT.unitOfMs.asSecond * 3);
  }, [saveUpdated]);

  useEffect(() => {
    debouncedSave(formStore.getState(), configStore.getState());
  }, [debouncedSave, formStore, configStore]);

  useEffect(() => {
    return () => {
      saveUpdated(getFormState(), getConfigState()).catch((error) => {
        console.error('[useBudgetingAutoSave] 언마운트 저장 실패:', error);
      });
    };
  }, [saveUpdated, getFormState, getConfigState]);
};
