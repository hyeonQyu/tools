import {
  DaisoDisplayLocation,
  DaisoItemStoreStatus,
  DaisoShoppingGroup,
  DaisoShoppingSortType,
  DaisoStoreStock,
} from '@/features/daiso-shopping/types';
import { TIME_UNIT } from '@/lib';

/** Firestore는 undefined 값을 거부하므로 저장 직전에 제거한다. */
export const omitUndefined = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;

/** "2.1" -> 2.1 (파싱 실패 시 null) */
export const parseDaisoDistance = (distance?: string): number | null => {
  if (!distance) return null;
  const parsed = Number(distance);
  return Number.isFinite(parsed) ? parsed : null;
};

/** 다이소 원본 데이터에 좌표가 깨진 매장이 있어(13180km 등) 말이 안 되는 거리는 표시하지 않는다. */
const MAX_PLAUSIBLE_DISTANCE_KM = 1000;

export const formatDaisoDistance = (distance?: string): string | null => {
  const parsed = parseDaisoDistance(distance);
  if (parsed === null || parsed > MAX_PLAUSIBLE_DISTANCE_KM) return null;
  return `${parsed}km`;
};

const parseStair = (stairNo: string): number | null => {
  if (!stairNo.trim()) return null;
  const parsed = Number(stairNo);
  return Number.isFinite(parsed) ? parsed : null;
};

/** { zoneNo: '3', stairNo: '-1' } -> '지하 1층 · 3구역' */
export const formatDaisoLocationLabel = (location: DaisoDisplayLocation | null): string | null => {
  if (!location) return null;

  const stair = parseStair(location.stairNo);
  const floorLabel = stair === null ? null : stair < 0 ? `지하 ${Math.abs(stair)}층` : `${stair}층`;
  const zoneLabel = location.zoneNo.trim() ? `${location.zoneNo}구역` : null;

  const parts = [floorLabel, zoneLabel].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
};

/**
 * 매장 주소에서 재고 조회용 지역 키워드를 뽑아낸다.
 * `/api/daiso/inventory`는 lat/lng만 주면 가장 가까운 매장 1곳만 돌려주기 때문에,
 * "근처 매장 목록"을 만들려면 반드시 지역 키워드가 필요하다.
 *
 * 예) '서울 강남구 남부순환로 2748' -> '강남구'
 *     '경기도 용인시 기흥구 강남로 7' -> '기흥구'
 *     '제주특별자치도 제주시 연북로 1' -> '제주시'
 *     '세종특별자치시 나성로 96' -> '세종'
 */
export const getDaisoRegionKeyword = (address: string): string => {
  const tokens = address.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';

  // 시/도 바로 뒤 두 토큰까지만 본다. (그 뒤는 도로명이라 오탐이 생긴다)
  const candidates = tokens.slice(1, 3);

  const guGun = [...candidates].reverse().find((token) => /[구군]$/.test(token));
  if (guGun) return guGun;

  const si = candidates.find((token) => /시$/.test(token));
  if (si) return si;

  // 세종특별자치시처럼 시/도 자체가 최소 단위인 경우
  return tokens[0].replace(/(특별자치시|특별자치도|특별시|광역시|자치시|자치도|시|도)$/, '') || tokens[0];
};

export const sortDaisoStoresByDistance = (stores: DaisoStoreStock[]): DaisoStoreStock[] =>
  [...stores].sort((a, b) => {
    const distanceA = parseDaisoDistance(a.distance);
    const distanceB = parseDaisoDistance(b.distance);

    if (distanceA === null && distanceB === null) return a.storeName.localeCompare(b.storeName);
    if (distanceA === null) return 1;
    if (distanceB === null) return -1;
    return distanceA - distanceB;
  });

export const formatRelativeTimeFromNow = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  if (diff < TIME_UNIT.unitOfMs.asMinute) return '방금';

  const minutes = Math.floor(diff / TIME_UNIT.unitOfMs.asMinute);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(diff / TIME_UNIT.unitOfMs.asHour);
  if (hours < 24) return `${hours}시간 전`;

  return `${Math.floor(diff / TIME_UNIT.unitOfMs.asDay)}일 전`;
};

const DONE_GROUP_KEY = '__done__';
const UNKNOWN_LOCATION_GROUP_KEY = '__unknown_location__';
const OUT_OF_STOCK_GROUP_KEY = '__out_of_stock__';
const NOT_CARRIED_GROUP_KEY = '__not_carried__';
const CHECKING_GROUP_KEY = '__checking__';
const FAILED_GROUP_KEY = '__failed__';

interface AisleBucket {
  key: string;
  label: string;
  stair: number;
  zone: number;
  statuses: DaisoItemStoreStatus[];
}

const compareByOrderDesc = (a: DaisoItemStoreStatus, b: DaisoItemStoreStatus) => b.item.order - a.item.order;

/**
 * 매장 안에서 걸어다니는 순서(층 -> 구역)대로 물품을 묶는다.
 * 위치를 모르거나 재고가 없는 물품은 뒤쪽 버킷으로 밀어낸다.
 */
const groupByAisle = (statuses: DaisoItemStoreStatus[]): DaisoShoppingGroup[] => {
  const aisleBuckets = new Map<string, AisleBucket>();
  const unknownLocation: DaisoItemStoreStatus[] = [];
  const outOfStock: DaisoItemStoreStatus[] = [];
  const notCarried: DaisoItemStoreStatus[] = [];
  const checking: DaisoItemStoreStatus[] = [];
  const failed: DaisoItemStoreStatus[] = [];

  for (const status of statuses) {
    if (status.isStockError) {
      failed.push(status);
      continue;
    }

    if (status.quantity === null) {
      checking.push(status);
      continue;
    }

    if (!status.found) {
      notCarried.push(status);
      continue;
    }

    if (status.quantity <= 0) {
      outOfStock.push(status);
      continue;
    }

    const label = formatDaisoLocationLabel(status.location);
    if (!label || !status.location) {
      unknownLocation.push(status);
      continue;
    }

    const stair = parseStair(status.location.stairNo) ?? Number.MAX_SAFE_INTEGER;
    const zone = Number(status.location.zoneNo);
    const bucket = aisleBuckets.get(label);

    if (bucket) {
      bucket.statuses.push(status);
      continue;
    }

    aisleBuckets.set(label, {
      key: label,
      label,
      stair,
      zone: Number.isFinite(zone) ? zone : Number.MAX_SAFE_INTEGER,
      statuses: [status],
    });
  }

  const aisleGroups = Array.from(aisleBuckets.values())
    .sort((a, b) => a.stair - b.stair || a.zone - b.zone || a.label.localeCompare(b.label))
    .map(({ key, label, statuses: bucketStatuses }) => ({ key, label, statuses: bucketStatuses }));

  return [
    ...aisleGroups,
    { key: CHECKING_GROUP_KEY, label: '재고 확인 중', statuses: checking },
    { key: UNKNOWN_LOCATION_GROUP_KEY, label: '위치 정보 없음', statuses: unknownLocation },
    { key: OUT_OF_STOCK_GROUP_KEY, label: '재고 없음', statuses: outOfStock },
    { key: NOT_CARRIED_GROUP_KEY, label: '이 매장에서 취급하지 않음', statuses: notCarried },
    { key: FAILED_GROUP_KEY, label: '재고 확인 실패', statuses: failed },
  ];
};

export const getDaisoShoppingGroups = (
  statuses: DaisoItemStoreStatus[],
  sortBy: DaisoShoppingSortType,
  hasSelectedStore: boolean,
): DaisoShoppingGroup[] => {
  const pending = statuses.filter((status) => !status.item.done);
  const done = statuses.filter((status) => status.item.done);

  const doneGroup: DaisoShoppingGroup = {
    key: DONE_GROUP_KEY,
    label: '담은 항목',
    statuses: [...done].sort(compareByOrderDesc),
  };

  if (sortBy === 'aisle' && hasSelectedStore) {
    return [...groupByAisle(pending), doneGroup].filter((group) => group.statuses.length > 0);
  }

  const sorted =
    sortBy === 'stock'
      ? [...pending].sort((a, b) => (b.quantity ?? -1) - (a.quantity ?? -1) || compareByOrderDesc(a, b))
      : [...pending].sort(compareByOrderDesc);

  return [{ key: '__all__', label: '', statuses: sorted }, doneGroup].filter((group) => group.statuses.length > 0);
};
