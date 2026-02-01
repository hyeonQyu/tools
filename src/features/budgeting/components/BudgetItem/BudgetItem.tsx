import { useCalculateBudgetItemValue } from '@/features/budgeting/hooks';
import { useBudgetingConfigStore, useBudgetingStore } from '@/features/budgeting/stores';
import { formatAmount, parseInputWithUnit } from '@/lib';
import { Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { Box, Card, Checkbox, FormControlLabel, IconButton, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, HTMLAttributes } from 'react';
import NumericInput from '../NumericInput';

interface BudgetItemProps {
  itemId: string;
  dragHandleProps?: HTMLAttributes<HTMLElement>;
}

function BudgetItem({ itemId, dragHandleProps }: BudgetItemProps) {
  const item = useBudgetingStore((store) => store.items.find((i) => i.id === itemId));
  const allocationType = useBudgetingStore((store) => store.allocationType);

  const calculateBudgetItemValue = useCalculateBudgetItemValue();

  const updateItem = useBudgetingStore((store) => store.updateItem);
  const deleteItem = useBudgetingStore((store) => store.deleteItem);

  const inputUnit = useBudgetingConfigStore((store) => store.inputUnit);
  const controlUnit = useBudgetingConfigStore((store) => store.controlUnit);

  if (!item) return null;

  const { amount, percentage } = calculateBudgetItemValue(item);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateItem(itemId, { name: e.target.value });
  };

  const handleAmountChange = (value: number) => {
    const actualValue = parseInputWithUnit(value, inputUnit);
    updateItem(itemId, { value: actualValue });
  };

  const handlePercentageChange = (value: number) => {
    updateItem(itemId, { value });
  };

  const handleAmountFixedChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateItem(itemId, { isAmountFixed: e.target.checked });
  };

  const handleDelete = () => {
    deleteItem(itemId);
  };

  const isPercentageInput = !item.isAmountFixed && allocationType === 'percentage';

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        {/* 첫 번째 줄: 드래그 핸들, 이름, 삭제 버튼 */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box {...dragHandleProps} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
            <DragIndicatorIcon color="action" />
          </Box>
          <TextField fullWidth size="small" placeholder="예: 적금, 투자" value={item.name} onChange={handleNameChange} />
          <IconButton onClick={handleDelete} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Stack>

        {/* 두 번째 줄: 금액으로 고정 체크박스 */}
        <FormControlLabel
          control={<Checkbox checked={item.isAmountFixed} onChange={handleAmountFixedChange} size="small" />}
          label="금액으로 고정"
        />

        {/* 세 번째 줄: 금액/비율 입력 */}
        <Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {/* 금액 입력 */}
            <NumericInput
              label="금액"
              value={item.value / inputUnit}
              onChange={handleAmountChange}
              onIncrement={() => updateItem(itemId, { value: item.value + controlUnit })}
              onDecrement={() => updateItem(itemId, { value: Math.max(0, item.value - controlUnit) })}
              inputUnit={inputUnit}
              disabled={isPercentageInput}
            />

            {/* 비율 표시/입력 */}
            <NumericInput
              label="비율"
              value={isPercentageInput ? item.value : parseFloat(percentage.toFixed(1))}
              onChange={handlePercentageChange}
              onIncrement={() => {
                if (isPercentageInput) {
                  updateItem(itemId, { value: item.value + 1 });
                }
              }}
              onDecrement={() => {
                if (isPercentageInput) {
                  updateItem(itemId, { value: Math.max(0, item.value - 1) });
                }
              }}
              unit="%"
              disabled={!isPercentageInput}
            />
          </Stack>
        </Box>

        {/* 네 번째 줄: 계산된 값 표시 */}
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ px: 1 }}>
          <Typography variant="body2" color="text.secondary">
            = {formatAmount(amount)} ({percentage.toFixed(1)}%)
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default BudgetItem;
