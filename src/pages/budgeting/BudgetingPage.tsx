import {
  AllocationTypeSelector,
  BudgetingHeader,
  BudgetItemList,
  BudgetSummary,
  TotalAmountInput,
  useBudgetingAutoSave,
  useBudgetingLoad,
} from '@/features/budgeting';
import { Box, Stack } from '@mui/material';

function BudgetingPage() {
  useBudgetingLoad();
  useBudgetingAutoSave();

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack
        spacing={2}
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 10,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <BudgetingHeader />
        <BudgetSummary />
      </Stack>

      <Stack spacing={2} sx={{ px: 3, py: 2, mb: 2 }}>
        <TotalAmountInput />
        <AllocationTypeSelector />
        <BudgetItemList />
      </Stack>
    </Box>
  );
}

export default BudgetingPage;
