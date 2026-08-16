import { ToolLayout } from '@/components/ToolLayout';
import { CgvAlertAddButton, CgvAlertViewContainer, CgvAlertViewTabs } from '@/features/cgv-alert';

function CgvAlertPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <CgvAlertAddButton />
        </ToolLayout.Row>

        <CgvAlertViewTabs />
      </ToolLayout.Header>

      <CgvAlertViewContainer />
    </ToolLayout>
  );
}

export default CgvAlertPage;
