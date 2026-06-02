import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { getCellStatus, groupExpirationItemsByDateKey } from '@/features/expiration-dates/utils';
import { DAYS, getKstNow, toKstDateKey } from '@/lib';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface ExpirationDateCalendarProps {
  year: number;
  month: number;
  items: ExpirationDateItemEntity[];
  onCellClick: (date: Date, items: ExpirationDateItemEntity[]) => void;
}

const TOTAL_CELLS = 42;

function ExpirationDateCalendar({ year, month, items, onCellClick }: ExpirationDateCalendarProps) {
  const theme = useTheme();

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

  const itemsByDateKey = useMemo(() => groupExpirationItemsByDateKey(items), [items]);
  const todayKey = toKstDateKey(getKstNow());

  const statusBgColor: Record<string, string> = {
    expired: theme.palette.error.main,
    soon: theme.palette.warning.main,
    normal: theme.palette.primary.main,
  };

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
          const cellItems = itemsByDateKey.get(dateKey) ?? [];
          const status = getCellStatus(cellItems);
          const isToday = dateKey === todayKey;
          const bgColor = status ? statusBgColor[status] : undefined;
          const hasItems = cellItems.length > 0;

          return (
            <ButtonBase
              key={dateKey}
              onClick={() => onCellClick(cell, cellItems)}
              sx={{
                aspectRatio: '1 / 1',
                borderRadius: 1,
                bgcolor: bgColor || 'action.hover',
                outline: isToday ? 2 : 0,
                outlineColor: 'text.primary',
                outlineOffset: -2,
                color: hasItems ? '#fff' : 'text.primary',
                fontWeight: isToday ? 700 : 400,
                transition: 'background-color 0.15s',
                flexDirection: 'column',
                gap: 0.25,
              }}
            >
              <Typography variant="body2" component="span" lineHeight={1}>
                {cell.getDate()}
              </Typography>
              {hasItems && (
                <Typography variant="caption" component="span" lineHeight={1} sx={{ fontSize: '0.6rem', opacity: 0.9 }}>
                  {cellItems.length}
                </Typography>
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

export default ExpirationDateCalendar;
