import ToolLayoutBody from '@/components/ToolLayout/ToolLayoutBody';
import ToolLayoutHeader from '@/components/ToolLayout/ToolLayoutHeader';
import ToolLayoutRow from '@/components/ToolLayout/ToolLayoutRow';
import ToolLayoutTitle from '@/components/ToolLayout/ToolLayoutTitle';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
}

function ToolLayout({ children }: ToolLayoutProps) {
  return <Box sx={{ maxWidth: 900, mx: 'auto' }}>{children}</Box>;
}

ToolLayout.Header = ToolLayoutHeader;
ToolLayout.Row = ToolLayoutRow;
ToolLayout.Title = ToolLayoutTitle;
ToolLayout.Body = ToolLayoutBody;
export default ToolLayout;
