import { useDialog } from '@/dialog';
import { budgetingPresetService } from '@/features/budgeting/data';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { enqueueClosableSnackbar } from '@/styles';
import { useQuery } from '@tanstack/react-query';
import { BudgetingPresetNameDialog } from '../components/BudgetingPresetNameDialog';
import { useRefreshBudgetingPresetListQuery } from './useRefreshBudgetingPresetListQuery';

export const useCreateBudgetPreset = () => {
  const dialog = useDialog();
  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());
  const loadPreset = useBudgetingStore((store) => store.loadPreset);
  const refreshPresets = useRefreshBudgetingPresetListQuery();

  return async () => {
    await dialog.open<boolean>({
      title: '새 예산안 생성',
      content: (close) => (
        <BudgetingPresetNameDialog
          existingNames={(presets ?? []).map((p) => p.name)}
          close={close}
          onConfirm={async (name) => {
            const emptyForm = { totalAmount: 0, allocationType: 'amount' as const, items: [] };
            const presetId = await budgetingPresetService.save({ name, form: emptyForm });
            await refreshPresets();
            loadPreset(presetId, emptyForm);
            enqueueClosableSnackbar({ message: `"${name}" 예산안이 생성되었습니다.`, variant: 'success' });
          }}
        />
      ),
    });
  };
};
