import { BudgetItemList } from '@/features/budgeting/components';
import { useBudgetingAutoSave, useBudgetingLoad } from '@/features/budgeting/hooks';
import { Box, Stack } from '@mui/material';
import { AllocationTypeSelector, BudgetingHeader, BudgetSummary, TotalAmountInput } from './components';

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

      <Stack spacing={2} sx={{ px: 4, py: 2, mb: 2 }}>
        <TotalAmountInput />
        <AllocationTypeSelector />
        <BudgetItemList />
      </Stack>
    </Box>
  );
}

export default BudgetingPage;
