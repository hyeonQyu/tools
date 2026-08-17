import { useDialog } from '@/dialog';
import {
  useDaisoNearbyStores,
  useDaisoSelectedStore,
  useDaisoShoppingItemActions,
  useDaisoStoreActions,
} from '@/features/daiso-shopping/hooks';
import { getDaisoDisplayLocationQueryOptions, getDaisoStoreStockQueryOptions } from '@/features/daiso-shopping/queries';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoStoreStock } from '@/features/daiso-shopping/types';
import { formatDaisoDistance, formatDaisoLocationLabel } from '@/features/daiso-shopping/utils';
import { ImageNotSupported, MyLocation, PlaceOutlined, Refresh, Storefront } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export interface DaisoItemDetailDialogProps {
  itemId: string;
  close: () => void;
}

function DaisoItemDetailDialog({ itemId, close }: DaisoItemDetailDialogProps) {
  const item = useDaisoShoppingStore((s) => s.items.find((entity) => entity.id === itemId));
  const store = useDaisoSelectedStore();
  const { update, remove } = useDaisoShoppingItemActions();
  const { save: saveStore } = useDaisoStoreActions();
  const dialog = useDialog();

  const [memo, setMemo] = useState(item?.memo ?? '');

  const {
    data: stock,
    isFetching: isStockFetching,
    isError: isStockError,
    refetch: refetchStock,
  } = useQuery(getDaisoStoreStockQueryOptions(item?.productId ?? '', store));

  const { data: location, isFetching: isLocationFetching } = useQuery(
    getDaisoDisplayLocationQueryOptions(item?.productId ?? '', store?.storeCode ?? null, (stock?.quantity ?? 0) > 0),
  );

  const nearby = useDaisoNearbyStores(item?.productId ?? '');

  if (!item) {
    return (
      <Box sx={{ px: 3, pb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          물품 정보를 찾을 수 없습니다.
        </Typography>
      </Box>
    );
  }

  const locationLabel = formatDaisoLocationLabel(location?.locations[0] ?? null);

  const handleSaveEdits = async () => {
    if (memo === item.memo) return;
    await update(item.id, { memo });
  };

  const handleDelete = async () => {
    const confirmed = await dialog.confirm({ title: '물품 삭제', content: `${item.name}을(를) 목록에서 삭제할까요?` });
    if (!confirmed) return;
    await remove(item.id);
    close();
  };

  const handleSwitchStore = async (target: DaisoStoreStock) => {
    await saveStore(target);
    close();
  };

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar variant="rounded" src={item.imageUrl} sx={{ width: 88, height: 88, bgcolor: 'action.hover' }}>
            <ImageNotSupported color="disabled" />
          </Avatar>

          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} sx={{ whiteSpace: 'normal' }}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.price.toLocaleString()}원{item.brand ? ` · ${item.brand}` : ''}
            </Typography>
          </Stack>
        </Stack>

        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {store ? store.storeName : '선택한 매장 없음'}
            </Typography>
            {store && (
              <IconButton size="small" onClick={() => refetchStock()} disabled={isStockFetching} aria-label="재고 새로고침">
                <Refresh fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {!store && (
            <Typography variant="body2" color="text.secondary">
              매장을 선택하면 재고와 진열 위치를 볼 수 있어요.
            </Typography>
          )}

          {store && isStockError && (
            <Typography variant="body2" color="error">
              재고를 확인하지 못했습니다.
            </Typography>
          )}

          {store && !isStockError && (
            <Stack spacing={0.5}>
              {stock === undefined ? (
                <Skeleton variant="text" width={120} height={40} />
              ) : (
                <Typography variant="h5" fontWeight={700} color={stock.found && stock.quantity > 0 ? 'success.main' : 'text.secondary'}>
                  {!stock.found ? '이 매장에서 취급하지 않음' : stock.quantity > 0 ? `재고 ${stock.quantity}개` : '재고 없음'}
                </Typography>
              )}

              {(stock?.quantity ?? 0) > 0 &&
                (isLocationFetching ? (
                  <Skeleton variant="text" width={140} />
                ) : locationLabel ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PlaceOutlined fontSize="small" color="action" />
                    <Typography variant="body1" fontWeight={600}>
                      {locationLabel}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    진열 위치 정보 없음
                  </Typography>
                ))}

              {stock !== undefined && stock.onlineStock > 0 && (
                <Typography variant="caption" color="text.secondary">
                  온라인 재고 {stock.onlineStock}개
                </Typography>
              )}
            </Stack>
          )}
        </Paper>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <TextField
            label="메모"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            onBlur={handleSaveEdits}
            size="small"
            fullWidth
            multiline
            rows={2}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography variant="subtitle2" fontWeight={700}>
              주변 매장 재고
            </Typography>
            {nearby.isUsingCurrentLocation && (
              <Chip size="small" color="primary" variant="outlined" icon={<MyLocation />} label="현재 위치 기준" />
            )}
          </Stack>
          {nearby.isFetching && <CircularProgress size={16} />}
        </Stack>

        {nearby.geolocationStatus === 'denied' && (
          <Alert
            severity="info"
            variant="outlined"
            sx={{ mb: 1 }}
            action={
              <Button size="small" onClick={nearby.requestGeolocation} sx={{ whiteSpace: 'nowrap' }}>
                위치 사용
              </Button>
            }
          >
            위치 권한이 없어 선택한 매장 기준 거리로 표시합니다.
          </Alert>
        )}

        <TextField
          value={nearby.keyword}
          onChange={(e) => nearby.setKeyword(e.target.value)}
          placeholder={nearby.resolvedKeyword ? `${nearby.resolvedKeyword} (직접 입력해 변경)` : '지역명 (예: 강남구, 안산)'}
          size="small"
          fullWidth
          sx={{ mb: 1 }}
        />

        {nearby.isError && (
          <Alert severity="warning" variant="outlined" sx={{ my: 1 }} action={<Button onClick={() => nearby.refetch()}>다시 시도</Button>}>
            주변 매장 재고를 불러오지 못했습니다.
          </Alert>
        )}

        {!nearby.isFetching && !nearby.isError && nearby.stores.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            {nearby.resolvedKeyword || nearby.keyword.trim()
              ? '해당 지역에서 매장을 찾지 못했습니다.'
              : '지역명을 입력하면 매장별 재고를 볼 수 있어요.'}
          </Typography>
        )}

        <List disablePadding>
          {nearby.stores.map((nearbyStore) => {
            const distanceLabel = formatDaisoDistance(nearbyStore.distance);
            const isCurrent = nearbyStore.storeCode === store?.storeCode;

            return (
              <ListItem
                key={nearbyStore.storeCode}
                divider
                disableGutters
                secondaryAction={
                  isCurrent ? null : (
                    <IconButton edge="end" onClick={() => handleSwitchStore(nearbyStore)} aria-label="이 매장으로 전환">
                      <Storefront fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={isCurrent ? 700 : 400}>
                        {nearbyStore.storeName}
                      </Typography>
                      {nearbyStore.quantity > 0 ? (
                        <Chip size="small" color="success" label={`${nearbyStore.quantity}개`} />
                      ) : (
                        <Chip size="small" variant="outlined" label="재고 없음" />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                      {[distanceLabel, nearbyStore.address].filter(Boolean).join(' · ')}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Stack direction="row" spacing={1} sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button color="error" onClick={handleDelete}>
          삭제
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={async () => {
            await handleSaveEdits();
            close();
          }}
        >
          닫기
        </Button>
      </Stack>
    </Stack>
  );
}

export default DaisoItemDetailDialog;
