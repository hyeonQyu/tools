import { ToolLayout } from '@/components/ToolLayout';
import { WsServerAddButton, WsServerBody } from '@/features/ws-server';
import { Box } from '@mui/material';
import { Suspense } from 'react';

function WsServerPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <WsServerAddButton />
        </ToolLayout.Row>
      </ToolLayout.Header>

      <Suspense fallback={<Box sx={{ flex: 1 }} />}>
        <WsServerBody />
      </Suspense>
    </ToolLayout>
  );
}

export default WsServerPage;
