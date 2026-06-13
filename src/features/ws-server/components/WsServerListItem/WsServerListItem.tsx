import { useOpenWsServerDialog } from '@/features/ws-server/hooks';
import { getWsServerHealthCheckQueryOptions } from '@/features/ws-server/queries';
import { WsServerEntity } from '@/features/ws-server/types';
import { Cancel, CheckCircle, NetworkCheck } from '@mui/icons-material';
import { CircularProgress, IconButton, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface WsServerListItemProps {
  server: WsServerEntity;
}

function WsServerListItem({ server }: WsServerListItemProps) {
  const { openEdit } = useOpenWsServerDialog();
  const { data: healthStatus, isFetching, refetch } = useQuery(getWsServerHealthCheckQueryOptions(server));

  const label = server.displayName || server.url;
  const secondary = server.displayName ? server.url : undefined;

  const handleHealthCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    refetch();
  };

  return (
    <ListItem
      disablePadding
      divider
      secondaryAction={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {healthStatus === 'alive' && <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />}
          {healthStatus === 'dead' && <Cancel sx={{ color: 'error.main', fontSize: 18 }} />}

          <IconButton size="small" onClick={handleHealthCheck} disabled={isFetching}>
            {isFetching ? <CircularProgress size={20} /> : <NetworkCheck fontSize="small" />}
          </IconButton>
        </Stack>
      }
    >
      <ListItemButton onClick={() => openEdit(server)} sx={{ pr: 12 }}>
        <ListItemText primary={label} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  );
}

export default WsServerListItem;
