import { ToolLayout } from '@/components/ToolLayout';
import { ExpirationDateAddButton, ExpirationDateBody, ExpirationDateViewTabs } from '@/features/expiration-dates';
import { Box } from '@mui/material';
import { Suspense } from 'react';

function ExpirationDatesPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <ExpirationDateAddButton />
        </ToolLayout.Row>

        <ExpirationDateViewTabs />
      </ToolLayout.Header>

      <Suspense fallback={<Box sx={{ flex: 1 }} />}>
        <ExpirationDateBody />
      </Suspense>
    </ToolLayout>
  );
}

export default ExpirationDatesPage;
