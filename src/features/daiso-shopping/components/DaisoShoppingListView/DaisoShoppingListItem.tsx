import { DaisoItemStoreStatus } from '@/features/daiso-shopping/types';
import { formatDaisoLocationLabel } from '@/features/daiso-shopping/utils';
import { ImageNotSupported, PlaceOutlined } from '@mui/icons-material';
import { Avatar, Checkbox, Chip, ListItem, ListItemButton, Skeleton, Stack, Typography } from '@mui/material';
import { DaisoStockChip } from '../DaisoStockChip';

export interface DaisoShoppingListItemProps {
  status: DaisoItemStoreStatus;
  hasSelectedStore: boolean;
  onOpenDetail: () => void;
  onToggleDone: () => void;
}

function DaisoShoppingListItem({ status, hasSelectedStore, onOpenDetail, onToggleDone }: DaisoShoppingListItemProps) {
  const { item } = status;
  const locationLabel = formatDaisoLocationLabel(status.location);
  const isInStock = (status.quantity ?? 0) > 0;

  return (
    <ListItem disablePadding divider sx={{ opacity: item.done ? 0.5 : 1 }}>
      <ListItemButton onClick={onOpenDetail} sx={{ py: 1.25, gap: 1.25, alignItems: 'flex-start' }}>
        <Checkbox
          checked={item.done}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          sx={{ p: 0.5, mt: 0.25 }}
        />

        <Avatar variant="rounded" src={item.imageUrl} sx={{ width: 52, height: 52, bgcolor: 'action.hover', flexShrink: 0 }}>
          <ImageNotSupported fontSize="small" color="disabled" />
        </Avatar>

        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              whiteSpace: 'normal',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textDecoration: item.done ? 'line-through' : 'none',
            }}
          >
            {item.name}
          </Typography>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {item.price.toLocaleString()}원
            </Typography>
            {item.memo && (
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                · {item.memo}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack spacing={0.5} alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <DaisoStockChip status={status} hasSelectedStore={hasSelectedStore} />

          {hasSelectedStore && isInStock && status.isLocationLoading && <Skeleton variant="rounded" width={78} height={22} />}

          {hasSelectedStore && isInStock && !status.isLocationLoading && locationLabel && (
            <Chip size="small" variant="outlined" icon={<PlaceOutlined />} label={locationLabel} sx={{ maxWidth: 140 }} />
          )}

          {hasSelectedStore && isInStock && !status.isLocationLoading && !locationLabel && status.isLocationUnknown && (
            <Typography variant="caption" color="text.disabled">
              위치 정보 없음
            </Typography>
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}

export default DaisoShoppingListItem;
