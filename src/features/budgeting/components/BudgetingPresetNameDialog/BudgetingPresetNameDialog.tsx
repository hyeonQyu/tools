import { ConstraintError } from '@/lib';
import { Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useState } from 'react';

interface BudgetingPresetNameDialogProps {
  initialName?: string;
  existingNames: string[];
  confirmLabel?: string;
  close: (result?: boolean) => void;
  onConfirm: (name: string) => Promise<void>;
}

function BudgetingPresetNameDialog({
  initialName = '',
  existingNames,
  confirmLabel = '저장',
  close,
  onConfirm,
}: BudgetingPresetNameDialogProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trimmedName = name.trim();
  const isDuplicate = existingNames.includes(trimmedName);
  const isEmpty = trimmedName === '';
  const isUnchanged = initialName !== '' && trimmedName === initialName.trim();
  const isDisabled = isDuplicate || isEmpty || isUnchanged || loading;

  const handleConfirm = async () => {
    if (isDisabled) return;
    setLoading(true);
    setError('');
    try {
      await onConfirm(trimmedName);
      close(true);
    } catch (err) {
      setError(err instanceof ConstraintError ? err.message : '저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent>
        <TextField
          fullWidth
          label="예산안 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isDisabled) handleConfirm();
          }}
          error={isDuplicate || !!error}
          helperText={isDuplicate ? '이미 존재하는 이름입니다.' : error}
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close(false)} disabled={loading}>
          취소
        </Button>
        <Button fullWidth variant="contained" onClick={handleConfirm} disabled={isDisabled}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </>
  );
}

export default BudgetingPresetNameDialog;
