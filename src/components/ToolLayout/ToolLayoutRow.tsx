import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutRowProps extends StackProps {
  children: ReactNode;
}

function ToolLayoutRow({ children, ...props }: ToolLayoutRowProps) {
  return (
    <Stack direction="row" {...props}>
      {children}
    </Stack>
  );
}

export default ToolLayoutRow;
