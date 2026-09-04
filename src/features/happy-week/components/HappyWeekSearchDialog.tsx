import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import HappyWeekDeadlineSheet from '@/features/happy-week/components/HappyWeekDeadlineSheet';
import HappyWeekEmergencySheet from '@/features/happy-week/components/HappyWeekEmergencySheet';
import HappyWeekItemSheet from '@/features/happy-week/components/HappyWeekItemSheet';
import HappyWeekProcedureSheet from '@/features/happy-week/components/HappyWeekProcedureSheet';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekSnapshot } from '@/features/happy-week/types';
import {
  HappyWeekSearchEntry,
  HappyWeekSearchKind,
  SEARCH_KIND_LABEL,
  SEARCH_KIND_ORDER,
  buildHappyWeekSearchIndex,
  clampToTripRange,
  searchHappyWeek,
  toCestDateKey,
} from '@/features/happy-week/utils';
import { useAutoTimeoutFocus } from '@/hooks';
import { Close, History } from '@mui/icons-material';
import { Box, Chip, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';

interface HappyWeekSearchDialogProps {
  snapshot: HappyWeekSnapshot;
  now: Date;
  close: () => void;
}

/** 검색어 없이 열었을 때 눌러보게 두는 것들. 급한 순간의 질문을 미리 적어둔다. */
const SUGGESTED_QUERIES = ['주유', 'ZTL', '톨게이트', '번호판', '체크인', '좌석', '택시', '112', '주차', '세체다'];

const KIND_FILTERS: HappyWeekSearchKind[] = SEARCH_KIND_ORDER;

/**
 * 시간축이 못 잡는 것을 위한 폴백이다. 과거·먼 미래·과거 결정·오타.
 * 하단 고정 입력창은 iOS에서 Layout의 100vh 고정과 충돌해 깨지므로 Dialog로 연다.
 */
function HappyWeekSearchDialog({ snapshot, now, close }: HappyWeekSearchDialogProps) {
  const dialog = useDialog();
  const inputRef = useRef<HTMLInputElement>(null);
  useAutoTimeoutFocus(inputRef);

  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<HappyWeekSearchKind | null>(null);

  const recentQueries = useHappyWeekStore((state) => state.recentQueries);
  const pushRecentQuery = useHappyWeekStore((state) => state.pushRecentQuery);
  const setViewDateKey = useHappyWeekStore((state) => state.setViewDateKey);

  const index = useMemo(() => buildHappyWeekSearchIndex(snapshot), [snapshot]);
  const groups = useMemo(() => {
    const all = searchHappyWeek(index, query);
    return kindFilter ? all.filter((group) => group.kind === kindFilter) : all;
  }, [index, query, kindFilter]);

  const totalMatches = groups.reduce((sum, group) => sum + group.total, 0);
  const todayDateKey = clampToTripRange(snapshot, toCestDateKey(now));

  const openEntry = (entry: HappyWeekSearchEntry) => {
    pushRecentQuery(query);

    switch (entry.kind) {
      case 'item':
        void dialog.open({
          title: entry.payload.title,
          fullWidth: true,
          maxWidth: 'sm',
          slots: { transition: SlideUpTransition },
          content: () => <HappyWeekItemSheet item={entry.payload} />,
        });
        return;
      case 'deadline':
        void dialog.open({
          title: entry.payload.title,
          fullWidth: true,
          maxWidth: 'sm',
          slots: { transition: SlideUpTransition },
          content: () => <HappyWeekDeadlineSheet deadline={entry.payload} now={now} />,
        });
        return;
      case 'contact':
        void dialog.open({
          title: '긴급',
          fullWidth: true,
          maxWidth: 'sm',
          slots: { transition: SlideUpTransition },
          content: () => <HappyWeekEmergencySheet snapshot={snapshot} dateKey={todayDateKey} />,
        });
        return;
      case 'standby':
        void dialog.open({
          title: `${entry.payload.icon} ${entry.payload.title}`,
          fullWidth: true,
          maxWidth: 'sm',
          slots: { transition: SlideUpTransition },
          content: () => <HappyWeekProcedureSheet standby={entry.payload} />,
        });
        return;
      case 'gap':
        // 날짜가 있으면 그 날 레일로 보낸다. 거기서 '아직 안 채워진 것'에 보인다.
        if (entry.dateKey) {
          setViewDateKey(entry.dateKey);
          close();
          return;
        }
        void dialog.alert({ title: entry.payload.subject, content: `${entry.payload.detail}\n\n→ ${entry.payload.resolveHint}` });
        return;
      case 'browse':
        void dialog.alert({
          title: entry.payload.name,
          content: [entry.payload.desc, entry.payload.note ? `\n${entry.payload.note}` : ''].join(''),
        });
        return;
      case 'decision':
        void dialog.alert({
          title: `${entry.payload.date} · ${entry.payload.title}`,
          content: (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {entry.payload.body}
            </Typography>
          ),
        });
        return;
    }
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        placeholder="일정 · 주소 · 번호 · 절차 · 장소"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        slotProps={{
          input: {
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setQuery('')} aria-label="지우기">
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />

      <Stack direction="row" spacing={0.5} sx={{ overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {KIND_FILTERS.map((kind) => (
          <Chip
            key={kind}
            size="small"
            label={SEARCH_KIND_LABEL[kind]}
            color={kindFilter === kind ? 'primary' : 'default'}
            variant={kindFilter === kind ? 'filled' : 'outlined'}
            onClick={() => setKindFilter(kindFilter === kind ? null : kind)}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Stack>

      {!query && (
        <Stack spacing={1.5}>
          {recentQueries.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                최근
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {recentQueries.map((recent) => (
                  <Chip
                    key={recent}
                    size="small"
                    icon={<History sx={{ fontSize: 14 }} />}
                    label={recent}
                    onClick={() => setQuery(recent)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              자주 찾는 것
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {SUGGESTED_QUERIES.map((suggested) => (
                <Chip key={suggested} size="small" variant="outlined" label={suggested} onClick={() => setQuery(suggested)} />
              ))}
            </Stack>
          </Box>
        </Stack>
      )}

      {query && totalMatches === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          없음 — 초성으로도 찾아봤다
        </Typography>
      )}

      {groups.map((group) => (
        <Box key={group.kind}>
          <Divider sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {SEARCH_KIND_LABEL[group.kind]} {group.total}
            </Typography>
          </Divider>
          <Stack spacing={0.5}>
            {group.entries.map((entry) => (
              <Stack
                key={entry.id}
                direction="row"
                spacing={1}
                alignItems="center"
                onClick={() => openEntry(entry)}
                sx={(theme) => ({
                  cursor: 'pointer',
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: theme.glass.controlBackground,
                  border: `1px solid ${theme.glass.sheetBorder}`,
                })}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {entry.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {entry.subtitle}
                  </Typography>
                </Box>
              </Stack>
            ))}
            {group.total > group.entries.length && (
              <Typography variant="caption" color="text.disabled" sx={{ px: 1.25 }}>
                외 {group.total - group.entries.length}건 — 검색어를 더 구체적으로
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default HappyWeekSearchDialog;
