import { useBudgetCalculations, useBudgetingStore } from '@/features/budgeting';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { formatAmount } from '@/lib';
import { Alert, Chip, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

function BudgetSummary() {
  const totalAmount = useBudgetingStore((store) => store.totalAmount);
  const loadedPresetId = useBudgetingStore((store) => store.loadedPresetId);
  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());
  const loadedPresetName = presets?.find((preset) => preset.id === loadedPresetId)?.name;
  const { totalAllocatableAmount, restAllocatableAmount, isOverBudget, totalAllocatedAmount } = useBudgetCalculations();

  return (
    <>
      {loadedPresetName && (
        <Typography variant="body2" color="text.secondary">
          {loadedPresetName}
        </Typography>
      )}

      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Chip label={`분배 가능: ${formatAmount(totalAllocatableAmount)}`} color="default" variant="outlined" sx={{ flex: 1 }} />
        <Chip
          label={`잔여: ${formatAmount(restAllocatableAmount)}`}
          color={restAllocatableAmount < 0 ? 'error' : 'default'}
          variant="outlined"
          sx={{ flex: 1 }}
        />
      </Stack>

      {isOverBudget && (
        <Alert severity="error">
          입력된 금액의 합계({formatAmount(totalAllocatedAmount)})가 총 금액({formatAmount(totalAmount)})을 초과합니다
        </Alert>
      )}
    </>
  );
}

export default BudgetSummary;
