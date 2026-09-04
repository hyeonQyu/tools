import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import DayRail from '@/features/happy-week/components/DayRail';
import DayStrip from '@/features/happy-week/components/DayStrip';
import DeadlineStrip from '@/features/happy-week/components/DeadlineStrip';
import HappyWeekDeadlineSheet from '@/features/happy-week/components/HappyWeekDeadlineSheet';
import HappyWeekItemSheet from '@/features/happy-week/components/HappyWeekItemSheet';
import HappyWeekProcedureSheet from '@/features/happy-week/components/HappyWeekProcedureSheet';
import NextAnchorCard from '@/features/happy-week/components/NextAnchorCard';
import StandbyList from '@/features/happy-week/components/StandbyList';
import { useHappyWeekNow } from '@/features/happy-week/hooks';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekDeadline, HappyWeekItem, HappyWeekSnapshot, HappyWeekStandby } from '@/features/happy-week/types';
import {
  clampToTripRange,
  getBrowseForCity,
  getDayByDateKey,
  getGapsForDay,
  getItemsForDay,
  getNextAnchor,
  getPastDueDeadlines,
  getStandbyForDay,
  getUpcomingDeadlines,
  resolveBrowseCity,
  toCestDateKey,
} from '@/features/happy-week/utils';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

interface HappyWeekDayRailViewProps {
  snapshot: HappyWeekSnapshot;
}

function HappyWeekDayRailView({ snapshot }: HappyWeekDayRailViewProps) {
  const now = useHappyWeekNow();
  const dialog = useDialog();

  const viewDateKey = useHappyWeekStore((state) => state.viewDateKey);
  const setViewDateKey = useHappyWeekStore((state) => state.setViewDateKey);
  const munichCarDay = useHappyWeekStore((state) => state.munichCarDay);
  const dismissedDeadlineIds = useHappyWeekStore((state) => state.dismissedDeadlineIds);

  const todayDateKey = toCestDateKey(now);
  const activeDateKey = clampToTripRange(snapshot, viewDateKey);
  const isToday = activeDateKey === todayDateKey;

  const day = getDayByDateKey(snapshot, activeDateKey);
  const items = useMemo(() => getItemsForDay(snapshot, activeDateKey, munichCarDay), [snapshot, activeDateKey, munichCarDay]);
  const gaps = useMemo(() => getGapsForDay(snapshot, activeDateKey), [snapshot, activeDateKey]);

  const nextAnchor = isToday ? getNextAnchor(items, now) : null;
  const previousAnchorAtUtc = useMemo(() => {
    if (!nextAnchor) return null;
    const passed = items.filter((item) => item.startUtc !== null && new Date(item.startUtc).getTime() <= now.getTime());
    return passed.length > 0 ? (passed[passed.length - 1].startUtc as string) : null;
  }, [items, nextAnchor, now]);

  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(snapshot, now, dismissedDeadlineIds), [snapshot, now, dismissedDeadlineIds]);
  const pastDueDeadlines = useMemo(() => getPastDueDeadlines(snapshot, now, dismissedDeadlineIds), [snapshot, now, dismissedDeadlineIds]);

  const browseCity = resolveBrowseCity(snapshot, day?.stayCity ?? null);
  const browseItems = useMemo(() => getBrowseForCity(snapshot, browseCity), [snapshot, browseCity]);
  const shouldExpandBrowse = day?.planDepth !== 'detailed' && browseItems.length > 0;

  const standbyItems = useMemo(() => getStandbyForDay(snapshot, activeDateKey), [snapshot, activeDateKey]);

  const openProcedureSheet = (standby: HappyWeekStandby) => {
    void dialog.open({
      title: `${standby.icon} ${standby.title}`,
      fullWidth: true,
      maxWidth: 'sm',
      slots: { transition: SlideUpTransition },
      content: () => <HappyWeekProcedureSheet standby={standby} />,
    });
  };

  const openItemSheet = (item: HappyWeekItem) => {
    void dialog.open({
      title: item.title,
      fullWidth: true,
      maxWidth: 'sm',
      slots: { transition: SlideUpTransition },
      content: () => <HappyWeekItemSheet item={item} />,
    });
  };

  const openDeadlineSheet = (deadline: HappyWeekDeadline) => {
    void dialog.open({
      title: deadline.title,
      fullWidth: true,
      maxWidth: 'sm',
      slots: { transition: SlideUpTransition },
      content: () => <HappyWeekDeadlineSheet deadline={deadline} now={now} />,
    });
  };

  return (
    <>
      {/*
        불투명 배경을 깔면 페이지 그라디언트가 이 구간만 뚝 끊긴다.
        레일이 이 아래로 지나가므로 가리는 대신 흐린다.
      */}
      <Box
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          zIndex: 2,
          pb: 1,
          mx: -2,
          px: 2,
          backdropFilter: theme.glass.sheetBlur,
          WebkitBackdropFilter: theme.glass.sheetBlur,
        })}
      >
        <Stack spacing={1}>
          {nextAnchor && <NextAnchorCard item={nextAnchor} now={now} previousAtUtc={previousAnchorAtUtc} onClick={openItemSheet} />}

          <DeadlineStrip upcoming={upcomingDeadlines} pastDue={pastDueDeadlines} now={now} onSelect={openDeadlineSheet} />

          <DayStrip days={snapshot.days} viewDateKey={activeDateKey} todayDateKey={todayDateKey} onSelect={setViewDateKey} />
        </Stack>
      </Box>

      {day && day.character && (
        <Typography variant="caption" color="text.secondary">
          {day.character}
        </Typography>
      )}

      {items.length === 0 && (
        <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" fontWeight={600}>
            고정 일정 없음
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {day?.planDepthNote ?? '이 날은 레일에 놓인 항목이 없다'}
          </Typography>
        </Card>
      )}

      <DayRail items={items} now={now} showNowLine={isToday} onSelectItem={openItemSheet} />

      {/*
        출발일에는 준비 항목이 한꺼번에 몰려 15건이 넘는다. 전부 펼치면 일정이 화면 밖으로 밀리므로
        접어 두고 개수만 보여준다. docOrder 순서가 곧 작성자가 매긴 우선순위다.
      */}
      {gaps.length > 0 && (
        <Accordion disableGutters variant="outlined">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" fontWeight={600} color="warning.main">
              아직 안 채워진 것 ({gaps.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.25}>
              {gaps.map((gap) => (
                <Box key={gap.id}>
                  <Typography variant="body2" fontWeight={600}>
                    {gap.subject}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {gap.detail}
                  </Typography>
                  <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                    → {gap.resolveHint}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/*
        defaultExpanded는 마운트 때만 먹는다. DayStrip으로 날짜를 옮겨도 다시 판단하도록
        두 아코디언을 날짜로 리마운트한다.

        주유·톨게이트·ZTL처럼 그 구간에서 처음 해보는 절차. 운전일에 펼쳐 둔다 —
        주유소 앞에서 아코디언을 한 번 더 여는 탭은 비싸다.
      */}
      {standbyItems.length > 0 && (
        <Accordion key={`standby-${activeDateKey}`} defaultExpanded={day?.isDrivingDay === true} disableGutters variant="outlined">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" fontWeight={600}>
              이 날 상비 ({standbyItems.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StandbyList standby={standbyItems} onSelect={openProcedureSheet} />
          </AccordionDetails>
        </Accordion>
      )}

      {browseItems.length > 0 && (
        <Accordion key={`browse-${activeDateKey}`} defaultExpanded={shouldExpandBrowse} disableGutters variant="outlined">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" fontWeight={600}>
              {browseCity}에서 ({browseItems.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {browseItems.map((browseItem) => (
                <Box key={browseItem.id}>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600}>
                      {browseItem.name}
                    </Typography>
                    {browseItem.rank !== null && (
                      <Chip size="small" label={`${browseItem.rank}순위`} sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                    {browseItem.confidence === 'unverified' && (
                      <Chip size="small" color="warning" variant="outlined" label="확인필요" sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {browseItem.desc}
                  </Typography>
                  {browseItem.note && (
                    <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                      {browseItem.note}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      <Typography variant="caption" color="text.disabled" sx={{ pb: 2 }}>
        스냅샷 기준일 {snapshot.meta.builtAt} · {snapshot.meta.warning}
      </Typography>
    </>
  );
}

export default HappyWeekDayRailView;
