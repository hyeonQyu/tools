import { ExpirationDateItemEntity, ExpirationDateItemPayload } from '@/features/expiration-dates/types';
import { Autocomplete, Box, Button, Chip, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useState } from 'react';

export interface ExpirationDateItemDialogProps {
  close: (result?: ExpirationDateItemPayload) => void;
  initialValues?: ExpirationDateItemEntity;
  locationSuggestions: string[];
  tagSuggestions: string[];
  confirmLabel: string;
  onConfirm: (payload: ExpirationDateItemPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function ExpirationDateItemDialog({
  close,
  initialValues,
  locationSuggestions,
  tagSuggestions,
  confirmLabel,
  onConfirm,
  onDelete,
}: ExpirationDateItemDialogProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [expirationDate, setExpirationDate] = useState<Date | null>(initialValues?.expirationDate ?? null);
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [memo, setMemo] = useState(initialValues?.memo ?? '');
  const [loading, setLoading] = useState(false);

  const isValid = name.trim() !== '' && expirationDate !== null;

  const handleConfirm = async () => {
    if (!isValid || !expirationDate) return;
    setLoading(true);
    try {
      await onConfirm({ name: name.trim(), expirationDate, location, tags, memo });
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

      <DatePicker
        label="유통기한"
        value={expirationDate ? dayjs(expirationDate) : null}
        onChange={(val) => setExpirationDate(val ? val.toDate() : null)}
        slotProps={{ textField: { fullWidth: true, required: true } }}
      />

      <Autocomplete
        freeSolo
        options={locationSuggestions}
        value={location}
        onInputChange={(_, value) => setLocation(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="위치"
            placeholder="예: 냉장실"
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

export default ExpirationDateItemDialog;
