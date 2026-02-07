import { useQueryCurrentBudgeting } from '@/features/budgeting/hooks/useQueryCurrentBudgeting';
import { BudgetingConfigStates, BudgetingStates, useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { useIndexedDBStore } from '@/indexed-db';
import { TIME_UNIT } from '@/lib';
import { debounce, isEqual } from 'es-toolkit';
import { useCallback, useEffect, useMemo } from 'react';

export const useBudgetingAutoSave = () => {
  const { data } = useQueryCurrentBudgeting();

  const formStore = useBudgetingStore();
  const configStore = useBudgetingConfigStore();

  const getFormState = useBudgetingStore((store) => store.getState);
  const getConfigState = useBudgetingConfigStore((store) => store.getState);

  const idbStore = useIndexedDBStore('current-budgeting');

  const saveUpdated = useCallback(
    async (formState: BudgetingStates, configState: BudgetingConfigStates) => {
      if (!idbStore || !data) return;

      try {
        if (isEqual(formState, data.form) && isEqual(configState, data.config)) {
          return;
        }

        const updatedData = {
          id: data.id,
          form: formState,
          config: configState,
          savedAt: Date.now(),
        };

        await idbStore.update('current-budgeting', updatedData);
        console.log('[useBudgetingAutoSave] 저장 완료:', updatedData);
      } catch (error) {
        console.error('[useBudgetingAutoSave] 저장 실패:', error);
      }
    },
    [idbStore, data],
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
