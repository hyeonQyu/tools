import { HappyWeekDay } from '@/features/happy-week/types';
import { Box, Chip, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';

interface DayStripProps {
  days: HappyWeekDay[];
  viewDateKey: string;
  todayDateKey: string;
  onSelect: (dateKey: string) => void;
}

const RISK_ICON = {
  critical: '⚠️',
  transfer: '🚚',
  normal: '',
} as const;

/**
 * 14일 날짜 칩. 가로 스크롤이고 현재 보고 있는 날이 자동으로 가운데로 온다.
 * 스와이프 대신 이걸로 날짜를 옮긴다 — SlideTabViews가 children을 두 번 렌더해서
 * 타이머가 있는 레일을 넣으면 두 벌 돌기 때문이다.
 */
function DayStrip({ days, viewDateKey, todayDateKey, onSelect }: DayStripProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [viewDateKey]);

  return (
    <Box
      sx={{
        overflowX: 'auto',
        overflowY: 'hidden',
        mx: -2,
        px: 2,
        py: 0.5,
        // 14칸짜리 짧은 스트립이라 스크롤바가 칩만큼 두껍게 보인다. 손가락으로 미는 UI라 숨긴다.
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ width: 'max-content' }}>
        {days.map((day) => {
          const isActive = day.dateKey === viewDateKey;
          const isToday = day.dateKey === todayDateKey;
          const riskIcon = RISK_ICON[day.riskLevel];

          return (
            <Chip
              key={day.dateKey}
              ref={isActive ? activeRef : undefined}
              size="small"
              label={`${riskIcon}${day.dayNo} ${day.weekday}`}
              onClick={() => onSelect(day.dateKey)}
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{
                flexShrink: 0,
                fontWeight: isToday ? 700 : 400,
                // 오늘은 선택 여부와 무관하게 밑줄로 표시한다 — 다른 날을 보고 있어도
                // "오늘이 어디인지"를 잃지 않아야 한다.
                borderBottom: isToday ? '2px solid' : undefined,
                borderBottomColor: isToday ? 'error.main' : undefined,
                borderBottomLeftRadius: isToday ? 0 : undefined,
                borderBottomRightRadius: isToday ? 0 : undefined,
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default DayStrip;
