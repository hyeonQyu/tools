import { AppRoutesPathname, useCurrentRouteNode } from '@/routes';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

function ToolLayoutTitle() {
  const { pathname } = useLocation();
  const currentRouteNode = useCurrentRouteNode(pathname as AppRoutesPathname);

  return (
    <Typography variant="h5" fontWeight={600} sx={{ m: 0 }}>
      {currentRouteNode?._metadata.name ?? 'Untitled'}
    </Typography>
  );
}

export default ToolLayoutTitle;
