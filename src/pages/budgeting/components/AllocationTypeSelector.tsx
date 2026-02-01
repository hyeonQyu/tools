import { useBudgetingStore } from '@/features/budgeting/stores';
import { AllocationType } from '@/features/budgeting/types';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

function AllocationTypeSelector() {
  const allocationType = useBudgetingStore((store) => store.allocationType);
  const setAllocationType = useBudgetingStore((store) => store.setAllocationType);

  const handleAllocationTypeChange = (_: React.MouseEvent<HTMLElement>, newType: AllocationType | null) => {
    if (newType !== null) {
      setAllocationType(newType);
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        분배 방식
      </Typography>
      <ToggleButtonGroup value={allocationType} exclusive onChange={handleAllocationTypeChange} fullWidth size="small">
        <ToggleButton value="percentage">비율(%)</ToggleButton>
        <ToggleButton value="amount">금액(원)</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default AllocationTypeSelector;
