import { useBudgetingConfigStore } from '@/features/budgeting/stores';
import { BudgetingUnit } from '@/features/budgeting/types';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface BudgetingConfigDialogProps {
  close: (result?: void) => void;
}

function BudgetingConfigDialog({ close }: BudgetingConfigDialogProps) {
  const inputUnit = useBudgetingConfigStore((store) => store.inputUnit);
  const controlUnit = useBudgetingConfigStore((store) => store.controlUnit);
  const setInputUnit = useBudgetingConfigStore((store) => store.setInputUnit);
  const setControlUnit = useBudgetingConfigStore((store) => store.setControlUnit);

  const [tempInputUnit, setTempInputUnit] = useState<BudgetingUnit>(inputUnit);
  const [tempControlUnit, setTempControlUnit] = useState<BudgetingUnit>(controlUnit);

  const handleSave = () => {
    setInputUnit(tempInputUnit);
    setControlUnit(tempControlUnit);
    close();
  };

  const unitLabels: Record<BudgetingUnit, string> = {
    1: '1원',
    10000: '1만원',
    100000: '10만원',
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
              입력과 조정에 사용할 단위를 설정합니다.
            </Typography>
          </Box>

          <FormControl>
            <FormLabel id="input-unit-label">입력 단위</FormLabel>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 0.5 }}>
              숫자를 직접 입력할 때 적용되는 단위입니다
            </Typography>
            <RadioGroup
              aria-labelledby="input-unit-label"
              value={tempInputUnit}
              onChange={(e) => setTempInputUnit(Number(e.target.value) as BudgetingUnit)}
            >
              <FormControlLabel value={1} control={<Radio />} label={unitLabels[1]} />
              <FormControlLabel value={10000} control={<Radio />} label={unitLabels[10000]} />
              <FormControlLabel value={100000} control={<Radio />} label={unitLabels[100000]} />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="control-unit-label">조정 단위</FormLabel>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 0.5 }}>
              +/- 버튼으로 금액을 조정할 때 증감되는 단위입니다
            </Typography>
            <RadioGroup
              aria-labelledby="control-unit-label"
              value={tempControlUnit}
              onChange={(e) => setTempControlUnit(Number(e.target.value) as BudgetingUnit)}
            >
              <FormControlLabel value={1} control={<Radio />} label={unitLabels[1]} />
              <FormControlLabel value={10000} control={<Radio />} label={unitLabels[10000]} />
              <FormControlLabel value={100000} control={<Radio />} label={unitLabels[100000]} />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => close()}>취소</Button>
        <Button onClick={handleSave} variant="contained">
          저장
        </Button>
      </DialogActions>
    </>
  );
}

export default BudgetingConfigDialog;
