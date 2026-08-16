import {
  CGV_SPECIAL_SCREEN_GRADES,
  CGV_TRIGGER_LABELS,
  CGV_WEEKDAY_LABELS,
  CgvDateRange,
  CgvTimeRange,
  CgvWatchEntity,
} from '@/features/cgv-alert/types';

export const getSpecialScreenName = (code: string) => CGV_SPECIAL_SCREEN_GRADES.find((grade) => grade.code === code)?.name ?? code;

/** `YYYYMMDD` → `8/22(토)`. 인자는 이미 KST 기준 달력 날짜이므로 로컬 Date로 파싱해도 요일이 어긋나지 않는다. */
export const formatScnYmd = (scnYmd: string) => {
  const year = Number(scnYmd.slice(0, 4));
  const month = Number(scnYmd.slice(4, 6));
  const day = Number(scnYmd.slice(6, 8));
  if (!year || !month || !day) return scnYmd;

  const weekday = CGV_WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
  return `${month}/${day}(${weekday})`;
};

const formatDateRange = (dateRange: CgvDateRange) => {
  switch (dateRange.type) {
    case 'WITHIN_DAYS':
      return `${dateRange.days}일 이내`;
    case 'RANGE':
      return `${formatScnYmd(dateRange.from)}~${formatScnYmd(dateRange.to)}`;
    case 'ALL':
    default:
      return null;
  }
};

const formatTimeRange = (timeRange: CgvTimeRange) => {
  const format = (time: string) => `${time.slice(0, 2)}:${time.slice(2, 4)}`;
  return `${format(timeRange.startTm)}~${format(timeRange.endTm)}`;
};

/** 목록 아이템 부제목에 쓰는 한 줄 요약. 제한이 없는 항목은 아예 표기하지 않는다. */
export const formatCgvWatchSummary = (watch: CgvWatchEntity) => {
  const { triggers, filters } = watch;

  const parts: string[] = [triggers.map((trigger) => CGV_TRIGGER_LABELS[trigger]).join('·')];

  if (filters.sscnsGradCds.length > 0) parts.push(filters.sscnsGradCds.map(getSpecialScreenName).join('·'));
  if (filters.movNm) parts.push(filters.movNm);

  const dateRange = formatDateRange(filters.dateRange);
  if (dateRange) parts.push(dateRange);

  if (filters.weekdays.length > 0) parts.push(filters.weekdays.map((weekday) => CGV_WEEKDAY_LABELS[weekday]).join(''));
  if (filters.timeRange) parts.push(formatTimeRange(filters.timeRange));

  return parts.join(' · ');
};
