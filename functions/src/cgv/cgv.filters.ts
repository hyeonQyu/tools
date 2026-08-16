import { checkIsScnYmd, getDaysFromToday, getScnYmdWeekday, toNormalizedMinutes } from '../lib/time.utils';
import type { CgvWatchFilter } from '../types/cgvAlert.types';
import type { CgvShowtime } from './cgv.types';

/**
 * 감시 항목 필터. 빈 배열/`null`은 모두 "제한 없음"으로 취급한다.
 */

/** `dateRange` 조건을 만족하는지. */
const checkMatchesDateRange = (scnYmd: string, filters: CgvWatchFilter, now: Date): boolean => {
  const { dateRange } = filters;
  if (dateRange.type === 'ALL') return true;
  if (dateRange.type === 'WITHIN_DAYS') {
    const days = getDaysFromToday(scnYmd, now);
    return days >= 0 && days <= dateRange.days;
  }
  return scnYmd >= dateRange.from && scnYmd <= dateRange.to;
};

/** `weekdays` 조건을 만족하는지. KST 달력 기준 요일로 비교한다. */
const checkMatchesWeekday = (scnYmd: string, filters: CgvWatchFilter): boolean =>
  filters.weekdays.length === 0 || filters.weekdays.includes(getScnYmdWeekday(scnYmd));

/** 상영일 단위 필터(날짜 범위 + 요일). */
export const checkMatchesDateFilters = (scnYmd: string, filters: CgvWatchFilter, now: Date = new Date()): boolean =>
  checkIsScnYmd(scnYmd) &&
  getDaysFromToday(scnYmd, now) >= 0 &&
  checkMatchesDateRange(scnYmd, filters, now) &&
  checkMatchesWeekday(scnYmd, filters);

/**
 * `timeRange` 조건을 만족하는지. `scnsrtTm`(상영 시작 시각) 기준.
 * CGV가 자정 넘긴 회차를 `2445`처럼 표기하므로 하루 안의 분 단위로 정규화한 뒤 비교한다.
 * 시작 > 종료인 범위(예: 22:00~02:00)는 자정을 걸치는 범위로 해석한다.
 */
const checkMatchesTimeRange = (showtime: CgvShowtime, filters: CgvWatchFilter): boolean => {
  const { timeRange } = filters;
  if (!timeRange) return true;

  const target = toNormalizedMinutes(showtime.scnsrtTm);
  const start = toNormalizedMinutes(timeRange.startTm);
  const end = toNormalizedMinutes(timeRange.endTm);
  if (target === null || start === null || end === null) return true;

  return start <= end ? target >= start && target <= end : target >= start || target <= end;
};

/**
 * 특별관 등급 조건을 만족하는지.
 *
 * CGV는 특별관 등급을 두 축으로 나눠 준다. 실측 결과:
 * - `tcscnsGradCd`(TCSCNS_GRAD_CD): 상영 기술. `02` 4DX, `03` 아이맥스, `04` SCREENX ...
 * - `sascnsGradCd`(SASCNS_GRAD_CD): 상영관 사양. `08` 프리미엄관, `12` 아트하우스, `06` CINE de CHEF ...
 *
 * 클라이언트가 쓰는 `CGV_SPECIAL_SCREEN_GRADES` 상수에는 두 축의 코드가 섞여 있고
 * (`08`/`12`는 SASCNS 축에만 존재) 감시 항목은 코드를 축 구분 없이 한 배열(`sscnsGradCds`)로 저장한다.
 * 따라서 두 축 모두와 대조한다. 그렇게 하지 않으면 프리미엄관/아트하우스를 고른 감시 항목이
 * 아무것도 매칭하지 못한 채 조용히 죽는다.
 *
 * 대신 축 사이에 코드가 겹칠 수 있다는 점은 감수한다(예: `07`은 TCSCNS에서 DOLBY ATMOS,
 * SASCNS에서 씨네앤포레). 알림이 조금 더 오는 쪽이 아예 안 오는 쪽보다 낫다고 판단했다.
 */
const checkMatchesSpecialScreen = (showtime: CgvShowtime, filters: CgvWatchFilter): boolean =>
  filters.sscnsGradCds.length === 0 ||
  filters.sscnsGradCds.includes(showtime.tcscnsGradCd ?? '') ||
  filters.sscnsGradCds.includes(showtime.sascnsGradCd ?? '');

/** 회차 단위 필터(특별관 등급 + 영화 + 상영 시각). */
export const checkMatchesShowtimeFilters = (showtime: CgvShowtime, filters: CgvWatchFilter): boolean => {
  if (!checkMatchesSpecialScreen(showtime, filters)) return false;
  if (filters.movNo && showtime.movNo !== filters.movNo) return false;
  return checkMatchesTimeRange(showtime, filters);
};
