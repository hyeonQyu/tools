import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { getKstNow, toKstDateKey } from '@/lib';

export type ExpirationDateStatus = 'expired' | 'soon' | 'normal';

const SOON_DAYS = 3;

export const getExpirationStatus = (expirationDate: Date): ExpirationDateStatus => {
  const now = getKstNow();
  const diffMs = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= SOON_DAYS) return 'soon';
  return 'normal';
};

export const getAdjacentExpirationMonth = (
  { year, month }: { year: number; month: number },
  direction: 'prev' | 'next',
): { year: number; month: number } => {
  if (direction === 'prev') {
    return month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  }
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
};

export const filterExpirationItemsByMonth = (
  items: ExpirationDateItemEntity[],
  { year, month }: { year: number; month: number },
): ExpirationDateItemEntity[] => {
  return items.filter((item) => {
    const d = item.expirationDate;
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

export const groupExpirationItemsByDateKey = (items: ExpirationDateItemEntity[]): Map<string, ExpirationDateItemEntity[]> => {
  const map = new Map<string, ExpirationDateItemEntity[]>();
  for (const item of items) {
    const key = toKstDateKey(item.expirationDate);
    const existing = map.get(key) ?? [];
    map.set(key, [...existing, item]);
  }
  return map;
};

export const getCellStatus = (items: ExpirationDateItemEntity[]): ExpirationDateStatus | null => {
  if (items.length === 0) return null;
  const statuses = items.map((item) => getExpirationStatus(item.expirationDate));
  if (statuses.includes('expired')) return 'expired';
  if (statuses.includes('soon')) return 'soon';
  return 'normal';
};
