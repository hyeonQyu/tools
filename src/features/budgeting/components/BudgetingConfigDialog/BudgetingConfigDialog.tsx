import { useBudgetingConfigStore } from '@/features/budgeting/stores';
import { BudgetingUnit } from '@/features/budgeting/types';
import { Box, Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import BudgetingUnitRadioFormControl from './BudgetingUnitRadioFormControl';

interface BudgetingConfigDialogProps {
  close: (result?: void) => void;
}

const BUDGETING_UNITS: BudgetingUnit[] = [1, 10000, 100000];

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

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
              입력과 조정에 사용할 단위를 설정합니다.
            </Typography>
          </Box>

          <BudgetingUnitRadioFormControl
            labelId="input-unit-label"
            label="입력 단위"
            description="숫자를 직접 입력할 때 적용되는 단위입니다"
            value={tempInputUnit}
            units={BUDGETING_UNITS}
            onChange={setTempInputUnit}
          />

          <BudgetingUnitRadioFormControl
            labelId="control-unit-label"
            label="조정 단위"
            description="+/- 버튼으로 금액을 조정할 때 증감되는 단위입니다"
            value={tempControlUnit}
            units={BUDGETING_UNITS}
            onChange={setTempControlUnit}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close()}>
          취소
        </Button>
        <Button fullWidth onClick={handleSave} variant="contained">
          저장
        </Button>
      </DialogActions>
    </>
  );
}

export default BudgetingConfigDialog;
