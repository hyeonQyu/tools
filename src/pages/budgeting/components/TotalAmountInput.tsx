import { useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { formatAmount, parseInputWithUnit } from '@/lib';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

function TotalAmountInput() {
  const totalAmount = useBudgetingStore((store) => store.totalAmount);
  const setTotalAmount = useBudgetingStore((store) => store.setTotalAmount);
  const inputUnit = useBudgetingConfigStore((store) => store.inputUnit);
  const controlUnit = useBudgetingConfigStore((store) => store.controlUnit);

  const displayTotalAmount = totalAmount / inputUnit;

  const handleTotalAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value) || 0;
    const actualValue = parseInputWithUnit(inputValue, inputUnit);
    setTotalAmount(actualValue);
  };

  const handleIncrementTotal = () => {
    setTotalAmount(totalAmount + controlUnit);
  };

  const handleDecrementTotal = () => {
    setTotalAmount(Math.max(0, totalAmount - controlUnit));
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        총 금액
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={handleDecrementTotal} size="small" sx={{ border: 1, borderColor: 'divider' }}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          fullWidth
          type="number"
          value={displayTotalAmount}
          onChange={handleTotalAmountChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    원
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
        <IconButton onClick={handleIncrementTotal} size="small" sx={{ border: 1, borderColor: 'divider' }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {formatAmount(totalAmount)}
      </Typography>
    </Box>
  );
}

export default TotalAmountInput;
