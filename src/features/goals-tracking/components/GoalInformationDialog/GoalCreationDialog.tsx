import { ColorSelector } from '@/components/ColorSelector';
import { Button, DialogActions, DialogContent, FormLabel, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface GoalInformationDialogProps {
  close: (result?: void) => void;
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
];

function GoalInformationDialog({ close }: GoalInformationDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(GOAL_COLORS[0]);

  const handleCreate = () => {};

  return (
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <TextField
            label="목표 이름"
            slotProps={{ input: { placeholder: '예: 운동하기, 독서하기' } }}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          생성
        </Button>
      </DialogActions>
    </>
  );
}

export default GoalInformationDialog;
