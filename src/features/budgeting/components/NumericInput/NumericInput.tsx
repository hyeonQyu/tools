import { BudgetingUnit } from '@/features/budgeting/types';
import { getUnitLabel } from '@/features/budgeting/utils.ts';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

interface NumericInputProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'type' | 'inputMode'> {
  value: number;
  onChange: (value: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  inputUnit?: BudgetingUnit;
  unit?: string;
}

function NumericInput({ value, onChange, onIncrement, onDecrement, inputUnit, unit, disabled, ...textFieldProps }: NumericInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(parseFloat(inputValue) || 0);
    }
  };

  const unitLabel = unit || (inputUnit ? getUnitLabel(inputUnit) : '');

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
      <IconButton onClick={onDecrement} size="small" sx={{ border: 1, borderColor: 'divider' }} disabled={disabled}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <TextField
        {...textFieldProps}
        fullWidth
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          ...textFieldProps.slotProps,
          input: {
            ...textFieldProps.slotProps?.input,
            endAdornment: (
              <InputAdornment position="end" sx={{ minWidth: 'fit-content' }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}>
                  {unitLabel}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
      />
      <IconButton onClick={onIncrement} size="small" sx={{ border: 1, borderColor: 'divider' }} disabled={disabled}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

export default NumericInput;
