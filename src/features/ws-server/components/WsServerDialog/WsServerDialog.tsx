import { WsServerEntity } from '@/features/ws-server/types';
import { useAutoTimeoutFocus } from '@/hooks';
import { ConstraintError } from '@/lib';
import { Button, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

export interface WsServerDialogValues {
  url: string;
  healthCheckEndpoint: string;
  displayName: string;
}

export interface WsServerDialogProps {
  close: () => void;
  initialValues?: WsServerEntity;
  confirmLabel: string;
  onConfirm: (values: WsServerDialogValues) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function WsServerDialog({ close, initialValues, confirmLabel, onConfirm, onDelete }: WsServerDialogProps) {
  const isEdit = initialValues !== undefined;

  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [healthCheckEndpoint, setHealthCheckEndpoint] = useState(initialValues?.healthCheckEndpoint ?? '');
  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? '');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const firstFocusRef = useRef<HTMLInputElement>(null);
  useAutoTimeoutFocus(firstFocusRef);

  const isValid = url.trim() !== '';

  const handleConfirm = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await onConfirm({ url: url.trim(), healthCheckEndpoint, displayName });
      close();
    } catch (e) {
      if (e instanceof ConstraintError) {
        setUrlError(e.message);
      }
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
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <TextField
            inputRef={isEdit ? undefined : firstFocusRef}
            label="서버 URL"
            placeholder="예: ws://localhost:8080"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError(null);
            }}
            error={urlError !== null}
            helperText={urlError}
            disabled={isEdit}
            required
            fullWidth
          />

          <TextField
            inputRef={isEdit ? firstFocusRef : undefined}
            label="헬스 체크 엔드포인트"
            placeholder="예: http://localhost:8080/health (미입력 시 서버 URL 사용)"
            value={healthCheckEndpoint}
            onChange={(e) => setHealthCheckEndpoint(e.target.value)}
            fullWidth
          />

          <TextField
            label="표시명"
            placeholder="예: 로컬 개발 서버"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2, gap: 1 }}>
        {onDelete && (
          <Button color="error" onClick={handleDelete} disabled={loading} sx={{ mr: 'auto' }}>
            삭제
          </Button>
        )}
        <Button onClick={close} disabled={loading}>
          취소
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!isValid || loading}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </>
  );
}

export default WsServerDialog;
