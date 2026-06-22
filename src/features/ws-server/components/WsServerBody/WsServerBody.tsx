import { useWsServers } from '@/features/ws-server/hooks';
import { Box, List, Typography } from '@mui/material';
import { WsServerListItem } from '../WsServerListItem';

function WsServerBody() {
  const servers = useWsServers();

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
      {servers.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            등록된 서버가 없습니다.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {servers.map((server) => (
            <WsServerListItem key={server.id} server={server} />
          ))}
        </List>
      )}
    </Box>
  );
}

export default WsServerBody;
