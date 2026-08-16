import { ToolLayout } from '@/components/ToolLayout';
import { DaisoShoppingAddButton, DaisoShoppingBody } from '@/features/daiso-shopping';
import { Box } from '@mui/material';
import { Suspense } from 'react';

function DaisoShoppingPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <DaisoShoppingAddButton />
        </ToolLayout.Row>
      </ToolLayout.Header>

      <Suspense fallback={<Box sx={{ flex: 1 }} />}>
        <DaisoShoppingBody />
      </Suspense>
    </ToolLayout>
  );
}

export default DaisoShoppingPage;
