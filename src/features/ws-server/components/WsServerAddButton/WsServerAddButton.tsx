import { useOpenWsServerDialog } from '@/features/ws-server/hooks';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function WsServerAddButton() {
  const { openAdd } = useOpenWsServerDialog();

  return (
    <IconButton onClick={() => openAdd()}>
      <Add />
    </IconButton>
  );
}

export default WsServerAddButton;
