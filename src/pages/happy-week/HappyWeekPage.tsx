import { ToolLayout } from '@/components/ToolLayout';
import {
  HAPPY_WEEK_SNAPSHOT,
  HappyWeekDayRailView,
  HappyWeekHeaderMeta,
  HappyWeekSearchButton,
  HappyWeekSosButton,
  HappyWeekTripRailView,
  HappyWeekViewTabs,
  useHappyWeekStore,
} from '@/features/happy-week';
import { Stack } from '@mui/material';

function HappyWeekPage() {
  const currentView = useHappyWeekStore((state) => state.currentView);

  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ spacing: 1, py: 1.5 }}>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <Stack direction="row" spacing={0.5}>
            <HappyWeekSearchButton snapshot={HAPPY_WEEK_SNAPSHOT} />
            <HappyWeekSosButton snapshot={HAPPY_WEEK_SNAPSHOT} />
          </Stack>
        </ToolLayout.Row>

        <HappyWeekHeaderMeta snapshot={HAPPY_WEEK_SNAPSHOT} />
        <HappyWeekViewTabs />
      </ToolLayout.Header>

      <ToolLayout.Body sx={{ px: 2, spacing: 1.5 }}>
        {/* SlideTabViews를 쓰지 않는다 — children을 두 번 렌더해서 레일의 타이머가 두 벌 돈다. */}
        {currentView === 'today' ? (
          <HappyWeekDayRailView snapshot={HAPPY_WEEK_SNAPSHOT} />
        ) : (
          <HappyWeekTripRailView snapshot={HAPPY_WEEK_SNAPSHOT} />
        )}
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default HappyWeekPage;
