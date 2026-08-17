import { useDaisoShoppingItemActions } from '@/features/daiso-shopping/hooks/useDaisoShoppingItemActions';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoProduct } from '@/features/daiso-shopping/types';
import { enqueueClosableSnackbar } from '@/styles';
import { AddShoppingCart, ImageNotSupported } from '@mui/icons-material';
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export interface DaisoProductPreviewDialogProps {
  product: DaisoProduct;
  close: () => void;
}

function DaisoProductPreviewDialog({ product, close }: DaisoProductPreviewDialogProps) {
  const { add } = useDaisoShoppingItemActions();
  const isSaved = useDaisoShoppingStore((s) => s.items.some((item) => item.productId === product.id));
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await add(product);
      enqueueClosableSnackbar({ message: `${product.name}을(를) 담았습니다.`, variant: 'success' });
      close();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          borderRadius: 1,
          minHeight: 200,
          overflow: 'hidden',
        }}
      >
        {product.imageUrl ? (
          <Box component="img" src={product.imageUrl} alt={product.name} sx={{ width: '100%', maxHeight: '55vh', objectFit: 'contain' }} />
        ) : (
          <ImageNotSupported fontSize="large" color="disabled" />
        )}
      </Box>

      <Stack spacing={0.5}>
        <Typography variant="body1" fontWeight={600} sx={{ whiteSpace: 'normal' }}>
          {product.name}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            {product.price.toLocaleString()}원
          </Typography>
          {product.brand && (
            <Typography variant="body2" color="text.secondary">
              · {product.brand}
            </Typography>
          )}
          {product.soldOut && <Chip size="small" color="error" variant="outlined" label="온라인 품절" />}
          {product.isNew && <Chip size="small" color="primary" variant="outlined" label="신상품" />}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button fullWidth onClick={close}>
          닫기
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={isSaved || isAdding}
          startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : <AddShoppingCart />}
          onClick={handleAdd}
        >
          {isSaved ? '담김' : '담기'}
        </Button>
      </Stack>
    </Stack>
  );
}

export default DaisoProductPreviewDialog;
