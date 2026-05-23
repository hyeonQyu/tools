import { dateFormat } from '@/date';
import { ConstraintError, getKstNow, toKstMidnightDate } from '@/lib';
import { CheckCircle, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useState } from 'react';

export type FuelPaymentRecordResult = { date: Date; userId: string };

export type FuelPaymentGroupMember = { id: string; name: string; color: string };

export interface FuelPaymentRecordDialogProps {
  groupMembers: FuelPaymentGroupMember[];
  defaultValues?: Partial<FuelPaymentRecordResult>;
  close: (result?: FuelPaymentRecordResult) => void;
  confirmConfig: {
    label: string;
    onConfirm: (result: FuelPaymentRecordResult) => Promise<void>;
  };
  onDelete?: () => Promise<void>;
}

function FuelPaymentRecordDialog({ groupMembers, defaultValues, close, confirmConfig, onDelete }: FuelPaymentRecordDialogProps) {
  const [date, setDate] = useState<Date>(defaultValues?.date ?? getKstNow());
  const [userId, setUserId] = useState<string | null>(defaultValues?.userId ?? null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!userId) return;
    try {
      await confirmConfig.onConfirm({ date: toKstMidnightDate(date), userId });
      close({ date: toKstMidnightDate(date), userId });
    } catch (e) {
      if (e instanceof ConstraintError) {
        setDateError(e.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete();
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <Stack spacing={1}>
            <FormLabel>날짜</FormLabel>
            <DatePicker
              value={dayjs(date)}
              format={dateFormat}
              onChange={(value) => {
                if (!value) return;
                setDate(value.toDate());
                setDateError(null);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError !== null,
                  helperText: dateError,
                },
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <FormLabel>사용자</FormLabel>
            {groupMembers.length === 0 ? (
              <TextField disabled value="선택할 멤버가 없습니다." size="small" fullWidth />
            ) : (
              <List disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                {groupMembers.map((member) => {
                  const isSelected = userId === member.id;
                  return (
                    <ListItemButton
                      key={member.id}
                      selected={isSelected}
                      onClick={() => setUserId(member.id)}
                      sx={{
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: 'primary.50' },
                        '&.Mui-selected:hover': { bgcolor: 'primary.100' },
                      }}
                    >
                      <Avatar sx={{ width: 24, height: 24, bgcolor: member.color }}>
                        <Box />
                      </Avatar>
                      <ListItemText
                        primary={member.name}
                        slotProps={{
                          primary: {
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? 'primary.main' : 'text.primary',
                          },
                        }}
                      />
                      {isSelected && <CheckCircle fontSize="small" color="primary" />}
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </Stack>

          {onDelete && (
            <Button fullWidth onClick={handleDelete} color="error" variant="outlined" startIcon={<DeleteIcon />}>
              삭제
            </Button>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close()}>
          취소
        </Button>
        <Button fullWidth onClick={handleConfirm} variant="contained" disabled={!userId}>
          {confirmConfig.label}
        </Button>
      </DialogActions>
    </>
  );
}

export default FuelPaymentRecordDialog;
