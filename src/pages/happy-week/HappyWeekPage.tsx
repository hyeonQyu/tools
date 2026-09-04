import { ToolLayout } from '@/components/ToolLayout';
import { HAPPY_WEEK_SNAPSHOT, HappyWeekDayRailView, HappyWeekHeaderMeta, HappyWeekSosButton } from '@/features/happy-week';

function HappyWeekPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ spacing: 1, py: 1.5 }}>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <HappyWeekSosButton snapshot={HAPPY_WEEK_SNAPSHOT} />
        </ToolLayout.Row>

        <HappyWeekHeaderMeta snapshot={HAPPY_WEEK_SNAPSHOT} />
      </ToolLayout.Header>

      <ToolLayout.Body sx={{ px: 2, spacing: 1.5 }}>
        <HappyWeekDayRailView snapshot={HAPPY_WEEK_SNAPSHOT} />
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default HappyWeekPage;
