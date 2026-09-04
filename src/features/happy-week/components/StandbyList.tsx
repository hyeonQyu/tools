import { HappyWeekStandby } from '@/features/happy-week/types';
import { ChevronRight } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

interface StandbyListProps {
  standby: HappyWeekStandby[];
  onSelect: (standby: HappyWeekStandby) => void;
}

const GROUP_LABEL: Record<HappyWeekStandby['group'], string> = {
  fuel: '주유',
  driving: '운전 · 톨게이트 · 주차',
  taxi: '택시',
  entry: '경기장 입장',
  luggage: '짐',
  rental: '렌터카',
  delay: '지연 · 결항',
  weather: '날씨',
};

const GROUP_ORDER: HappyWeekStandby['group'][] = ['fuel', 'driving', 'rental', 'taxi', 'entry', 'luggage', 'delay', 'weather'];

/** 그날 유효한 howto / playbook 카드. 그룹별로 묶고, 그룹 안에서는 priority 순. */
function StandbyList({ standby, onSelect }: StandbyListProps) {
  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: standby.filter((item) => item.group === group).sort((a, b) => a.priority - b.priority),
  })).filter((entry) => entry.items.length > 0);

  return (
    <Stack spacing={1.5}>
      {groups.map(({ group, items }) => (
        <Box key={group}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            {GROUP_LABEL[group]}
          </Typography>

          <Stack spacing={0.5}>
            {items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={1}
                alignItems="center"
                onClick={() => onSelect(item)}
                sx={(theme) => ({
                  cursor: 'pointer',
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: theme.glass.controlBackground,
                  border: `1px solid ${theme.glass.sheetBorder}`,
                })}
              >
                <Typography component="span" sx={{ flexShrink: 0 }}>
                  {item.icon}
                </Typography>
                <Typography variant="body2" fontWeight={item.dangerBanner ? 700 : 500} sx={{ flex: 1, minWidth: 0 }}>
                  {item.title}
                </Typography>
                {item.dangerBanner && (
                  <Typography variant="caption" color="error.main" fontWeight={700} sx={{ flexShrink: 0 }}>
                    위험
                  </Typography>
                )}
                <ChevronRight sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
              </Stack>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default StandbyList;
