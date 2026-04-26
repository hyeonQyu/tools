import { ColorSelector } from '@/components/ColorSelector';
import { useAutoTimeoutFocus } from '@/hooks';
import { ConstraintError } from '@/lib';
import { Button, DialogActions, DialogContent, FormLabel, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

export type GoalResult = {
  name: string;
  color: string;
};

export interface GoalInformationDialogProps {
  defaultValues?: GoalResult;
  close: (result?: GoalResult) => void;
  confirmConfig: {
    label: string;
    onConfirm: (result: GoalResult) => Promise<void>;
  };
}

const GOAL_COLORS = [
  '#ef5350',
  '#ec407a',
  '#ab47bc',
  '#7e57c2',
  '#42a5f5',
  '#26c6da',
  '#26a69a',
  '#66bb6a',
  '#d4e157',
  '#ffca28',
  '#ffa726',
  '#8d6e63',
  '#3949ab',
  '#c51162',
  '#aeea00',
  '#546e7a',
  '#e64a19',
  '#00e676',
];

function GoalInformationDialog({ defaultValues = { name: '', color: GOAL_COLORS[0] }, close, confirmConfig }: GoalInformationDialogProps) {
  const [name, setName] = useState(defaultValues.name);
  const [color, setColor] = useState(defaultValues.color);
  const [nameError, setNameError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  useAutoTimeoutFocus(nameInputRef);

  const handleCreate = async () => {
    try {
      return await confirmConfig.onConfirm({ name, color });
    } catch (e) {
      if (e instanceof ConstraintError) {
        setNameError(e.message);
      }
    }
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <TextField
            inputRef={nameInputRef}
            label="목표 이름"
            slotProps={{ input: { placeholder: '예: 운동하기, 독서하기' } }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            error={nameError !== null}
            helperText={nameError}
            fullWidth
          />

          <Stack spacing={1}>
            <FormLabel>색상</FormLabel>
            <ColorSelector colors={GOAL_COLORS} value={color} onChange={setColor} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close()}>
          취소
        </Button>
        <Button fullWidth onClick={handleCreate} variant="contained">
          {confirmConfig.label}
        </Button>
      </DialogActions>
    </>
  );
}

export default GoalInformationDialog;
