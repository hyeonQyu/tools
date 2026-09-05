import { HappyWeekDeadline } from '@/features/happy-week/types';
import { formatCountdown, parseSnapshotIso, toCestDateKey, toCestTimeText } from '@/features/happy-week/utils';
import { ChevronRight } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';

interface DeadlineStripProps {
  upcoming: HappyWeekDeadline[];
  pastDue: HappyWeekDeadline[];
  now: Date;
  onSelect: (deadline: HappyWeekDeadline) => void;
}

/** 화면 맨 위에 걸리는 값이라 한 건당 한 줄을 넘지 않는다. */
const VISIBLE_LIMIT = 2;

const formatDue = (deadline: HappyWeekDeadline) => {
  const due = parseSnapshotIso(deadline.dueUtc);
  return `${toCestDateKey(due).slice(5)} ${toCestTimeText(due)}`;
};

function DeadlineRow({
  deadline,
  trailing,
  color,
  onSelect,
}: {
  deadline: HappyWeekDeadline;
  trailing: string;
  color: 'error' | 'warning';
  onSelect: (deadline: HappyWeekDeadline) => void;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      onClick={() => onSelect(deadline)}
      sx={{
        cursor: 'pointer',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: `${color}.main`,
      }}
    >
      <Typography variant="caption" color={`${color}.main`} fontWeight={700} sx={{ flexShrink: 0 }}>
        ⛔
      </Typography>

      <Typography variant="caption" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
        {deadline.title}
      </Typography>

      <Typography variant="caption" color={`${color}.main`} fontWeight={700} fontFamily="monospace" sx={{ flexShrink: 0 }}>
        {trailing}
      </Typography>

      <ChevronRight sx={{ fontSize: 14, color: 'text.disabled', flexShrink: 0 }} />
    </Stack>
  );
}

/**
 * 마감은 "언제 일어나는 일"이 아니라 "언제까지 해야 하는 일"이라 레일 위가 아니라 그 위에 뜬다.
 *
 * 상세(무엇이 깨지는가·제약·등록 경로)는 여기 쓰지 않는다. 이 자리는 첫 화면 최상단이고,
 * 문단이 들어가면 정작 오늘 일정이 화면 밖으로 밀려난다. 탭하면 시트에서 전문을 본다.
 *
 * 지난 마감을 '완료됨'으로 표시하지 않는다 — 실제로 처리했는지 앱은 알 수 없다.
 */
function DeadlineStrip({ upcoming, pastDue, now, onSelect }: DeadlineStripProps) {
  if (upcoming.length === 0 && pastDue.length === 0) return null;

  const visibleUpcoming = upcoming.slice(0, VISIBLE_LIMIT);
  const hiddenCount = upcoming.length - visibleUpcoming.length;

  return (
    <Stack spacing={0.5}>
      {pastDue.map((deadline) => (
        <DeadlineRow key={deadline.id} deadline={deadline} trailing="지났음" color="warning" onSelect={onSelect} />
      ))}

      {visibleUpcoming.map((deadline) => {
        const countdown = formatCountdown(now, parseSnapshotIso(deadline.dueUtc));

        return (
          <DeadlineRow
            key={deadline.id}
            deadline={deadline}
            trailing={countdown ?? formatDue(deadline)}
            color="error"
            onSelect={onSelect}
          />
        );
      })}

      {hiddenCount > 0 && (
        <Box>
          <Chip size="small" variant="outlined" label={`마감 ${hiddenCount}건 더`} onClick={() => onSelect(upcoming[VISIBLE_LIMIT])} />
        </Box>
      )}
    </Stack>
  );
}

export default DeadlineStrip;
