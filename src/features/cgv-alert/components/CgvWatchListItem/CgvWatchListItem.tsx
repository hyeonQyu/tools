import { useOpenCgvWatchDialog, useToggleCgvWatch } from '@/features/cgv-alert/hooks';
import { CgvWatchEntity } from '@/features/cgv-alert/types';
import { formatCgvWatchSummary } from '@/features/cgv-alert/utils';
import { ListItem, ListItemButton, ListItemText, Switch } from '@mui/material';
import { MouseEvent } from 'react';

interface CgvWatchListItemProps {
  watch: CgvWatchEntity;
}

function CgvWatchListItem({ watch }: CgvWatchListItemProps) {
  const { openEdit } = useOpenCgvWatchDialog();
  const toggle = useToggleCgvWatch();

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    toggle(watch);
  };

  return (
    <ListItem
      disablePadding
      divider
      secondaryAction={<Switch edge="end" checked={watch.enabled} onClick={handleToggle} inputProps={{ 'aria-label': '감시 사용' }} />}
    >
      <ListItemButton onClick={() => openEdit(watch)} sx={{ pr: 12 }}>
        <ListItemText
          primary={watch.siteNm}
          secondary={formatCgvWatchSummary(watch)}
          slotProps={{
            primary: { sx: { opacity: watch.enabled ? 1 : 0.5 } },
            secondary: { sx: { opacity: watch.enabled ? 1 : 0.5 } },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default CgvWatchListItem;
