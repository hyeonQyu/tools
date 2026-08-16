/**
 * KST(+09:00) 기준 날짜/시각 유틸. Cloud Functions 인스턴스의 로컬 타임존은 UTC이므로
 * CGV가 내려주는 `YYYYMMDD` / `HHmm` 값은 반드시 여기 함수들을 통해서만 다룬다.
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const pad2 = (value: number) => String(value).padStart(2, '0');

/** `YYYYMMDD` 형식인지 검사한다. */
export const checkIsScnYmd = (value: unknown): value is string => typeof value === 'string' && /^\d{8}$/.test(value);

/** KST 기준 오늘 날짜를 `YYYYMMDD`로 반환한다. */
export const getKstTodayYmd = (now: Date = new Date()): string => {
  const shifted = new Date(now.getTime() + KST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}${pad2(shifted.getUTCMonth() + 1)}${pad2(shifted.getUTCDate())}`;
};

/** `YYYYMMDD`를 UTC 기준 자정 타임스탬프(ms)로 변환한다. 달력 날짜 연산 전용. */
const toYmdUtcMs = (scnYmd: string): number =>
  Date.UTC(Number(scnYmd.slice(0, 4)), Number(scnYmd.slice(4, 6)) - 1, Number(scnYmd.slice(6, 8)));

/** `YYYYMMDD`의 요일(0=일 ~ 6=토). CGV가 주는 날짜는 이미 KST 달력 날짜다. */
export const getScnYmdWeekday = (scnYmd: string): number => new Date(toYmdUtcMs(scnYmd)).getUTCDay();

/** `YYYYMMDD`가 오늘(KST)로부터 며칠 뒤인지. 과거면 음수. */
export const getDaysFromToday = (scnYmd: string, now: Date = new Date()): number =>
  Math.round((toYmdUtcMs(scnYmd) - toYmdUtcMs(getKstTodayYmd(now))) / MS_PER_DAY);

/** `20260822` -> `8월 22일(금)` */
export const formatScnYmd = (scnYmd: string): string => {
  const month = Number(scnYmd.slice(4, 6));
  const day = Number(scnYmd.slice(6, 8));
  return `${month}월 ${day}일(${WEEKDAY_LABELS[getScnYmdWeekday(scnYmd)]})`;
};

/**
 * `HHmm`을 하루 안의 분 단위로 정규화한다.
 * CGV는 자정을 넘긴 회차를 `2445`처럼 24시 이상으로 표기하므로 1440분으로 나눈 나머지를 쓴다.
 * (`2445` -> 00:45)
 */
export const toNormalizedMinutes = (hhmm: string): number | null => {
  if (typeof hhmm !== 'string' || !/^\d{3,4}$/.test(hhmm)) return null;
  const padded = hhmm.padStart(4, '0');
  const hour = Number(padded.slice(0, 2));
  const minute = Number(padded.slice(2, 4));
  if (minute > 59) return null;
  return (hour * 60 + minute) % MINUTES_PER_DAY;
};

/** `2445` -> `00:45`. 정규화에 실패하면 원본을 그대로 돌려준다. */
export const formatShowtime = (hhmm: string): string => {
  const minutes = toNormalizedMinutes(hhmm);
  if (minutes === null) return hhmm;
  return `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;
};
