import { getUnitLabel } from '@/features/budgeting/utils/budgeting.utils';
import { BudgetingUnit } from '@/features/budgeting/types';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

interface BudgetingUnitRadioFormControlProps {
  labelId: string;
  label: string;
  description: string;
  value: BudgetingUnit;
  units: BudgetingUnit[];
  onChange: (value: BudgetingUnit) => void;
}

function BudgetingUnitRadioFormControl({
  labelId,
  label,
  description,
  value,
  units,
  onChange,
}: BudgetingUnitRadioFormControlProps) {
  return (
    <FormControl>
      <FormLabel id={labelId}>{label}</FormLabel>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 0.5 }}>
        {description}
      </Typography>
      <RadioGroup aria-labelledby={labelId} value={value} onChange={(e) => onChange(Number(e.target.value) as BudgetingUnit)}>
        {units.map((unit) => (
          <FormControlLabel key={unit} value={unit} control={<Radio />} label={getUnitLabel(unit)} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default BudgetingUnitRadioFormControl;
