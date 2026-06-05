import { ToolLayout } from '@/components/ToolLayout';
import { BelongingsAddButton, BelongingsBody } from '@/features/belongings';
import { Box } from '@mui/material';
import { Suspense } from 'react';

function BelongingsPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <BelongingsAddButton />
        </ToolLayout.Row>
      </ToolLayout.Header>

      <Suspense fallback={<Box sx={{ flex: 1 }} />}>
        <BelongingsBody />
      </Suspense>
    </ToolLayout>
  );
}

export default BelongingsPage;
