import NumericInput from '@/features/budgeting/components/NumericInput';
import { useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { formatAmount, parseInputWithUnit } from '@/lib';
import { Box, Typography } from '@mui/material';

function TotalAmountInput() {
  const totalAmount = useBudgetingStore((store) => store.totalAmount);
  const setTotalAmount = useBudgetingStore((store) => store.setTotalAmount);
  const inputUnit = useBudgetingConfigStore((store) => store.inputUnit);
  const controlUnit = useBudgetingConfigStore((store) => store.controlUnit);

  const displayTotalAmount = totalAmount / inputUnit;

  const handleTotalAmountChange = (value: number) => {
    const actualValue = parseInputWithUnit(value, inputUnit);
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
      <NumericInput
        value={displayTotalAmount}
        onChange={handleTotalAmountChange}
        onIncrement={handleIncrementTotal}
        onDecrement={handleDecrementTotal}
        inputUnit={inputUnit}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {formatAmount(totalAmount)}
      </Typography>
    </Box>
  );
}

export default TotalAmountInput;
