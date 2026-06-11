import { BelongingItemEntity, BelongingItemPayload } from '@/features/belongings/types';
import { Autocomplete, Box, Button, Chip, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export interface BelongingItemDialogProps {
  close: (result?: BelongingItemPayload) => void;
  initialValues?: BelongingItemEntity;
  locationSuggestions: string[];
  tagSuggestions: string[];
  confirmLabel: string;
  onConfirm: (payload: BelongingItemPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function BelongingItemDialog({
  close,
  initialValues,
  locationSuggestions,
  tagSuggestions,
  confirmLabel,
  onConfirm,
  onDelete,
}: BelongingItemDialogProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [memo, setMemo] = useState(initialValues?.memo ?? '');
  const [loading, setLoading] = useState(false);

  const isValid = name.trim() !== '' && location.trim() !== '';

  const handleConfirm = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await onConfirm({ name: name.trim(), location: location.trim(), tags, memo });
      close();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
      <TextField label="이름" value={name} onChange={(e) => setName(e.target.value)} fullWidth autoFocus required />

      <Autocomplete
        freeSolo
        options={locationSuggestions}
        value={location}
        onInputChange={(_, value) => setLocation(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="위치"
            placeholder="예: 안방 옷장"
            required
            helperText={locationSuggestions.length === 0 ? '저장된 위치 없음' : undefined}
          />
        )}
      />

      <Autocomplete
        multiple
        freeSolo
        options={tagSuggestions}
        value={tags}
        onChange={(_, value) => setTags(value as string[])}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });
            return <Chip label={option} size="small" {...itemProps} key={key ?? `${option}-${index}`} />;
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="태그"
            placeholder="태그 입력 후 Enter"
            helperText={tagSuggestions.length === 0 ? '저장된 태그 없음' : undefined}
          />
        )}
      />

      <TextField label="메모" value={memo} onChange={(e) => setMemo(e.target.value)} fullWidth multiline rows={2} />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {onDelete && (
          <Button color="error" onClick={handleDelete} disabled={loading}>
            삭제
          </Button>
        )}
        <Button onClick={() => close()} disabled={loading}>
          취소
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!isValid || loading}>
          {confirmLabel}
        </Button>
      </Box>
    </Stack>
  );
}

export default BelongingItemDialog;
