import { DaisoItemStoreStatus } from '@/features/daiso-shopping/types';
import { Chip, Skeleton } from '@mui/material';

export interface DaisoStockChipProps {
  status: DaisoItemStoreStatus;
  hasSelectedStore: boolean;
}

function DaisoStockChip({ status, hasSelectedStore }: DaisoStockChipProps) {
  if (!hasSelectedStore) return null;

  if (status.isStockError) {
    return <Chip size="small" color="error" variant="outlined" label="확인 실패" />;
  }

  if (status.quantity === null) {
    return <Skeleton variant="rounded" width={52} height={24} />;
  }

  if (!status.found) {
    return <Chip size="small" color="warning" variant="outlined" label="미취급" />;
  }

  if (status.quantity <= 0) {
    return <Chip size="small" variant="outlined" label="재고 없음" />;
  }

  return <Chip size="small" color="success" label={`${status.quantity}개`} sx={{ fontWeight: 600 }} />;
}

export default DaisoStockChip;
