import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { getExpirationStatus } from '@/features/expiration-dates/utils';
import { Add, LocalOffer, Place } from '@mui/icons-material';
import { Box, Button, Chip, Divider, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

interface ExpirationDateDayItemsDialogProps {
  close: () => void;
  date: Date;
  items: ExpirationDateItemEntity[];
  onItemClick: (item: ExpirationDateItemEntity) => void;
  onAdd: () => void;
}

const STATUS_COLOR = {
  expired: 'error',
  soon: 'warning',
  normal: 'default',
} as const;

const STATUS_LABEL = {
  expired: '만료됨',
  soon: '임박',
  normal: undefined,
} as const;

function ExpirationDateDayItemsDialog({ close, date, items, onItemClick, onAdd }: ExpirationDateDayItemsDialogProps) {
  const dateLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <Box sx={{ pb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {dateLabel}
        </Typography>
        <IconButton size="small" onClick={onAdd}>
          <Add fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <List disablePadding>
        {items.map((item, index) => {
          const status = getExpirationStatus(item.expirationDate);
          const statusLabel = STATUS_LABEL[status];

          return (
            <ListItem
              key={item.id}
              divider={index < items.length - 1}
              onClick={() => {
                onItemClick(item);
                close();
              }}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, gap: 1 }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="body1">{item.name}</Typography>
                    {statusLabel && <Chip label={statusLabel} color={STATUS_COLOR[status]} size="small" />}
                  </Stack>
                }
                secondary={
                  <Stack direction="row" gap={1} flexWrap="wrap" mt={0.5}>
                    {item.location && (
                      <Stack direction="row" alignItems="center" gap={0.25}>
                        <Place sx={{ fontSize: 12 }} />
                        <Typography variant="caption">{item.location}</Typography>
                      </Stack>
                    )}
                    {item.tags.map((tag) => (
                      <Stack key={tag} direction="row" alignItems="center" gap={0.25}>
                        <LocalOffer sx={{ fontSize: 12 }} />
                        <Typography variant="caption">{tag}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: 3, pt: 2 }}>
        <Button fullWidth onClick={close}>
          닫기
        </Button>
      </Box>
    </Box>
  );
}

export default ExpirationDateDayItemsDialog;
