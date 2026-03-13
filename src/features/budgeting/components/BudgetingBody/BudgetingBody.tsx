import { AllocationTypeSelector, BudgetItemList, TotalAmountInput, useBudgetingAutoSave, useBudgetingLoad } from '@/features/budgeting';
import { Stack } from '@mui/material';

function BudgetingBody() {
  useBudgetingLoad();
  useBudgetingAutoSave();

  return (
    <Stack spacing={2}>
      <TotalAmountInput />
      <AllocationTypeSelector />
      <BudgetItemList />
    </Stack>
  );
}

export default BudgetingBody;
