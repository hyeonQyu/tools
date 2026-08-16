import { useDaisoProductSearch, useDaisoShoppingItemActions, useOpenDaisoProductPreviewDialog } from '@/features/daiso-shopping/hooks';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoProduct } from '@/features/daiso-shopping/types';
import { useAutoTimeoutFocus } from '@/hooks/useAutoTimeoutFocus';
import { enqueueClosableSnackbar } from '@/styles';
import { AddCircleOutline, ImageNotSupported, Search } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';

export interface DaisoProductSearchDialogProps {
  close: () => void;
}

function DaisoProductSearchDialog({ close }: DaisoProductSearchDialogProps) {
  const { keyword, setKeyword, products, hasMore, isFetching, isError, isSearched, loadMore } = useDaisoProductSearch();
  const { add } = useDaisoShoppingItemActions();
  const openPreview = useOpenDaisoProductPreviewDialog();
  const items = useDaisoShoppingStore((s) => s.items);
  const [addingId, setAddingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useAutoTimeoutFocus(inputRef);

  const savedProductIds = new Set(items.map((item) => item.productId));

  const handleAdd = async (product: DaisoProduct) => {
    setAddingId(product.id);
    try {
      await add(product);
      enqueueClosableSnackbar({ message: `${product.name}을(를) 담았습니다.`, variant: 'success' });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }}>
      <Box sx={{ px: 3, pb: 2 }}>
        <TextField
          inputRef={inputRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 수납박스, 건전지, 물티슈"
          size="small"
          fullWidth
          slotProps={{
            input: {
              inputMode: 'search',
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: isFetching ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 2 }}>
        {isError && (
          <Alert severity="error" variant="outlined" sx={{ mx: 2, my: 1 }}>
            상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </Alert>
        )}

        {!isSearched && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
            사고 싶은 물건을 검색해 보세요.
          </Typography>
        )}

        {isSearched && !isFetching && products.length === 0 && !isError && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
            검색 결과가 없습니다.
          </Typography>
        )}

        <List disablePadding>
          {products.map((product) => {
            const isSaved = savedProductIds.has(product.id);

            return (
              <ListItem
                key={product.id}
                divider
                disablePadding
                secondaryAction={
                  isSaved ? (
                    <Chip size="small" color="success" variant="outlined" label="담김" />
                  ) : (
                    <IconButton
                      edge="end"
                      onClick={() => handleAdd(product)}
                      disabled={addingId === product.id}
                      aria-label="장바구니에 담기"
                    >
                      {addingId === product.id ? <CircularProgress size={20} /> : <AddCircleOutline />}
                    </IconButton>
                  )
                }
              >
                {/* 행을 누르면 이미지를 크게 볼 수 있는 미리보기를 연다. */}
                <ListItemButton onClick={() => openPreview(product)} sx={{ pr: 7 }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={product.imageUrl} sx={{ width: 48, height: 48, bgcolor: 'action.hover' }}>
                      <ImageNotSupported fontSize="small" color="disabled" />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ pl: 1, pr: 4 }}
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'normal',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </Typography>
                    }
                    // secondary는 기본이 <p>라 Chip(<div>)을 넣으면 DOM 중첩 오류가 난다.
                    slotProps={{ secondary: { component: 'span' } }}
                    secondary={
                      <Stack direction="row" spacing={0.75} alignItems="center" component="span">
                        <Typography variant="caption" color="text.secondary" component="span">
                          {product.price.toLocaleString()}원
                        </Typography>
                        {product.brand && (
                          <Typography variant="caption" color="text.secondary" component="span">
                            · {product.brand}
                          </Typography>
                        )}
                        {product.soldOut && <Chip size="small" color="error" variant="outlined" label="온라인 품절" component="span" />}
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {hasMore && (
          <Button fullWidth onClick={loadMore} disabled={isFetching} sx={{ mt: 1 }}>
            더 보기
          </Button>
        )}
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button fullWidth variant="contained" onClick={close}>
          완료
        </Button>
      </Box>
    </Stack>
  );
}

export default DaisoProductSearchDialog;
