import {
  AllocationTypeSelector,
  BudgetItemList,
  TotalAmountInput,
  useBudgetingAutoSave,
  useBudgetingLoad,
  useBudgetingPresetMigration,
} from '@/features/budgeting';
import { useCreateBudgetPreset } from '@/features/budgeting/hooks/useCreateBudgetPreset';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

function BudgetingBody() {
  useBudgetingLoad();
  useBudgetingAutoSave();
  useBudgetingPresetMigration();

  const { data: presets } = useSuspenseQuery(getBudgetingPresetListQueryOptions());
  const createPreset = useCreateBudgetPreset();

  if (presets.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8, gap: 2 }}>
        <Typography color="text.secondary">아직 예산안이 없습니다.</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={createPreset}>
          새 예산안 생성
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <TotalAmountInput />
      <AllocationTypeSelector />
      <BudgetItemList />
    </Stack>
  );
}

export default BudgetingBody;
