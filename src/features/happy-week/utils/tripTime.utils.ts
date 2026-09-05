/**
 * [의도적 예외] 프로젝트 규칙(`.agents/rules/architecture.md`)은 모든 날짜 처리에
 * `src/lib/time.utils.ts`의 KST 유틸을 요구한다. 이 도구만 따르지 않는다.
 *
 * 여행 문서의 모든 시각은 유럽 현지(CEST = UTC+2)다. KST 유틸을 그대로 태우면
 * 전 일정이 7시간 틀어진다.
 *
 * 고정 +2가 안전한 근거:
 *   - 여행 전 기간(2026-09-05 ~ 2026-09-18)이 EU 서머타임 안이다 (전환은 10월 마지막 일요일)
 *   - 암스테르담·뮌헨·볼차노·베네치아가 모두 동일 존이다
 *   - 여행 기간 내내 DST 전환도 존 변경도 없다
 * 따라서 Intl / tz 라이브러리를 쓰지 않는다.
 *
 * KST 유틸을 대체하지 않고 형제로 복제한다 — 다른 도구는 그대로 KST를 쓴다.
 */

import { HappyWeekTz } from '@/features/happy-week/types';

const CEST_OFFSET_MS = 2 * 60 * 60 * 1000;

const pad2 = (value: number) => String(value).padStart(2, '0');

export const getCestDateParts = (date: Date) => {
  const cestDate = new Date(date.getTime() + CEST_OFFSET_MS);

  return {
    year: cestDate.getUTCFullYear(),
    month: cestDate.getUTCMonth(),
    day: cestDate.getUTCDate(),
    hour: cestDate.getUTCHours(),
    minute: cestDate.getUTCMinutes(),
  };
};

export const toCestDateKey = (date: Date) => {
  const { year, month, day } = getCestDateParts(date);
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
};

export const toCestTimeText = (date: Date) => {
  const { hour, minute } = getCestDateParts(date);
  return `${pad2(hour)}:${pad2(minute)}`;
};

export const toCestMidnightDate = (date: Date) => {
  const { year, month, day } = getCestDateParts(date);
  return new Date(Date.UTC(year, month, day) - CEST_OFFSET_MS);
};

/**
 * "지금". 기기 epoch를 그대로 쓴다 — 사용자가 폰 시계를 현지로 바꾸든 말든
 * 앱은 똑같이 동작한다.
 */
export const getCestNow = () => new Date();

/** 자정 기준 경과 분. 레일 정렬과 NOW 라인 위치 계산에 쓴다. */
export const toCestMinuteOfDay = (date: Date) => {
  const { hour, minute } = getCestDateParts(date);
  return hour * 60 + minute;
};

/** 스냅샷의 ISO 문자열(항상 Z 표기)을 Date로. */
export const parseSnapshotIso = (iso: string) => new Date(iso);

/**
 * 표기 규칙: 기본은 현지 시각이고 배지를 붙이지 않는다.
 * KST/베이징만 배지를 단다 — 09-05와 09-17~09-18 두 날에만 존이 섞인다.
 */
export const getTzBadge = (tz: HappyWeekTz): string | null => {
  if (tz === 'KST') return 'KST';
  if (tz === 'CST') return '베이징';
  return null;
};

export const TRIP_START_DATE_KEY = '2026-09-05';
export const TRIP_END_DATE_KEY = '2026-09-18';

export type TripPhase = 'before' | 'during' | 'after';

export const getTripPhase = (dateKey: string): TripPhase => {
  if (dateKey < TRIP_START_DATE_KEY) return 'before';
  if (dateKey > TRIP_END_DATE_KEY) return 'after';
  return 'during';
};

/**
 * 남은 시간. 음수면 null(이미 지남).
 *
 * 단위를 자릿수로 바꾼다 — '102:49'는 읽는 데 시간이 걸리지만 '4일 6시간'은 즉시 읽힌다.
 * 급할 때 보는 값이라 파싱 부담이 없어야 한다.
 */
export const formatCountdown = (fromDate: Date, toDate: Date): string | null => {
  const diffMs = toDate.getTime() - fromDate.getTime();
  if (diffMs < 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return hours > 0 ? `${days}일 ${hours}시간` : `${days}일`;
  if (hours > 0) return `${hours}:${pad2(minutes)}`;
  return `${minutes}분`;
};
