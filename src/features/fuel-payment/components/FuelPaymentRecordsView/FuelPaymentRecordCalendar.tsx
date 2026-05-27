import { FuelPaymentGroupMember } from '@/features/fuel-payment/components/FuelPaymentRecordDialog';
import { FuelPaymentRecord } from '@/features/fuel-payment/data/repositories';
import { DAYS, getKstNow, toKstDateKey } from '@/lib';
import { Box, ButtonBase, Typography } from '@mui/material';
import { useMemo } from 'react';

interface FuelPaymentRecordCalendarProps {
  year: number;
  month: number;
  records: FuelPaymentRecord[];
  groupMembers: FuelPaymentGroupMember[];
  onCellClick: (date: Date) => void;
}

const TOTAL_CELLS = 42;

function FuelPaymentRecordCalendar({ year, month, records, groupMembers, onCellClick }: FuelPaymentRecordCalendarProps) {
  const cells = useMemo<(Date | null)[]>(() => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay.getDay();

    return Array.from({ length: TOTAL_CELLS }, (_, i) => {
      const dayIndex = i - startOffset;
      if (dayIndex < 0 || dayIndex >= daysInMonth) return null;
      return new Date(year, month, dayIndex + 1);
    });
  }, [year, month]);

  const recordByDateKey = useMemo(() => new Map(records.map((r) => [toKstDateKey(r.date), r])), [records]);
  const colorById = useMemo(() => new Map(groupMembers.map((m) => [m.id, m.color])), [groupMembers]);
  const todayKey = toKstDateKey(getKstNow());

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
        {DAYS.map((day) => (
          <Typography key={day} variant="caption" align="center" color="text.secondary">
            {day}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {cells.map((cell, index) => {
          if (!cell) return <Box key={`empty-${index}`} sx={{ aspectRatio: '1 / 1' }} />;

          const dateKey = toKstDateKey(cell);
          const record = recordByDateKey.get(dateKey);
          const color = record ? colorById.get(record.userId) : undefined;
          const isToday = dateKey === todayKey;

          return (
            <ButtonBase
              key={dateKey}
              onClick={() => onCellClick(cell)}
              sx={{
                aspectRatio: '1 / 1',
                borderRadius: 1,
                bgcolor: color || 'action.hover',
                outline: isToday ? 2 : 0,
                outlineColor: 'text.primary',
                outlineOffset: -2,
                color: color ? '#fff' : 'text.primary',
                fontWeight: isToday ? 700 : 400,
                transition: 'background-color 0.15s',
              }}
            >
              <Typography variant="body2" component="span">
                {cell.getDate()}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

export default FuelPaymentRecordCalendar;
