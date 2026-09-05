import { HappyWeekStandby } from '@/features/happy-week/types';
import { enqueueClosableSnackbar } from '@/styles';
import { ContentCopy } from '@mui/icons-material';
import { Alert, Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

interface HappyWeekProcedureSheetProps {
  standby: HappyWeekStandby;
}

const LEVEL_COLOR = {
  normal: 'text.primary',
  warn: 'warning.main',
  forbid: 'error.main',
} as const;

const LEVEL_PREFIX = {
  normal: '',
  warn: '⚠️ ',
  forbid: '⛔ ',
} as const;

const copy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    enqueueClosableSnackbar({ message: '복사했습니다', variant: 'success' });
  } catch {
    enqueueClosableSnackbar({ message: '복사에 실패했습니다', variant: 'error' });
  }
};

/** howto / playbook 카드 하나의 전문. 주유소·톨게이트 앞에서 연다. */
function HappyWeekProcedureSheet({ standby }: HappyWeekProcedureSheetProps) {
  const isAddressCard = standby.kind === 'addressCard';

  return (
    <Stack spacing={1.5}>
      {standby.dangerBanner && (
        <Alert severity="error" variant="filled" sx={{ py: 0.75 }}>
          <Typography variant="body2" fontWeight={700}>
            {standby.dangerBanner}
          </Typography>
        </Alert>
      )}

      {standby.phrase && (
        <Box sx={(theme) => ({ p: 1.5, borderRadius: 2, bgcolor: theme.glass.controlBackground })}>
          <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
            {standby.phrase.native}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {standby.phrase.pronunciation}
          </Typography>
          {standby.phrase.en && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {standby.phrase.en}
            </Typography>
          )}
          {standby.phrase.placeholder && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              {standby.phrase.placeholder}
            </Typography>
          )}
        </Box>
      )}

      {standby.steps && standby.steps.length > 0 && (
        <Stack spacing={1}>
          {standby.steps.map((step) => (
            <Stack key={step.n} direction="row" spacing={1} alignItems="flex-start">
              <Typography
                variant="caption"
                fontFamily="monospace"
                fontWeight={700}
                sx={{ width: 22, flexShrink: 0, pt: 0.25, textAlign: 'right', color: LEVEL_COLOR[step.level] }}
              >
                {standby.kind === 'steps' ? step.n : '•'}
              </Typography>
              <Typography variant="body2" sx={{ color: LEVEL_COLOR[step.level], fontWeight: step.level === 'forbid' ? 600 : 400 }}>
                {LEVEL_PREFIX[step.level]}
                {step.text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      {standby.table && (
        <Box sx={{ overflowX: 'auto', mx: -1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {standby.table.headers.map((header, index) => (
                  <TableCell key={index} sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {header}
                  </TableCell>
                ))}
                {isAddressCard && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {standby.table.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    const swatch = standby.table?.swatchColumn === cellIndex ? standby.table.swatches?.[rowIndex] : undefined;

                    return (
                      <TableCell key={cellIndex} sx={{ verticalAlign: 'top' }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          {swatch && (
                            <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: swatch, border: '1px solid', borderColor: 'divider', flexShrink: 0 }} />
                          )}
                          <Typography variant="body2" sx={{ wordBreak: 'break-word', fontFamily: isAddressCard && cellIndex === 1 ? 'monospace' : undefined }}>
                            {cell}
                          </Typography>
                        </Stack>
                      </TableCell>
                    );
                  })}
                  {isAddressCard && (
                    <TableCell sx={{ px: 0.5 }}>
                      <IconButton size="small" onClick={() => void copy(row[row.length - 1])}>
                        <ContentCopy sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Stack>
  );
}

export default HappyWeekProcedureSheet;
