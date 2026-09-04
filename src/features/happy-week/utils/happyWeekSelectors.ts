import { MunichCarDay } from '@/features/happy-week/stores';
import {
  HappyWeekBrowseItem,
  HappyWeekContact,
  HappyWeekDay,
  HappyWeekDeadline,
  HappyWeekGap,
  HappyWeekItem,
  HappyWeekSnapshot,
  HappyWeekStandby,
} from '@/features/happy-week/types';
import { toCestDateKey } from '@/features/happy-week/utils/tripTime.utils';

/** dateKey에 일수를 더한다. 여행 기간이 2026년 9월 안에 갇혀 있어 단순 계산으로 충분하다. */
export const addDaysToDateKey = (dateKey: string, days: number) => {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const getDayByDateKey = (snapshot: HappyWeekSnapshot, dateKey: string): HappyWeekDay | null =>
  snapshot.days.find((day) => day.dateKey === dateKey) ?? null;

/** 여행 기간을 벗어난 날짜를 가장 가까운 여행일로 당긴다. */
export const clampToTripRange = (snapshot: HappyWeekSnapshot, dateKey: string) => {
  const first = snapshot.days[0]?.dateKey ?? dateKey;
  const last = snapshot.days[snapshot.days.length - 1]?.dateKey ?? dateKey;

  if (dateKey < first) return first;
  if (dateKey > last) return last;
  return dateKey;
};

/**
 * 뮌헨 렌터카가 아직 미확정이면 09-10·09-11 두 날 모두에 후보로 남긴다.
 * 확정되면 다른 날의 후보 아이템을 걷어낸다.
 */
const isVisibleUnderMunichCarDay = (item: HappyWeekItem, munichCarDay: MunichCarDay) => {
  if (!item.munichCarCandidate) return true;
  if (munichCarDay === null) return true;
  return item.dateKey === munichCarDay;
};

export const getItemsForDay = (snapshot: HappyWeekSnapshot, dateKey: string, munichCarDay: MunichCarDay): HappyWeekItem[] =>
  snapshot.items
    .filter((item) => item.dateKey === dateKey)
    .filter((item) => isVisibleUnderMunichCarDay(item, munichCarDay))
    .sort((a, b) => a.sortHint - b.sortHint);

/**
 * "다음에 뭐가 오는가". 아직 시작하지 않은 것 중 가장 이른 것.
 * 전부 지났으면 null — 그날의 레일이 끝났다는 뜻이다.
 */
export const getNextAnchor = (items: HappyWeekItem[], now: Date): HappyWeekItem | null => {
  const upcoming = items
    .filter((item) => item.startUtc !== null)
    .filter((item) => !item.flags.excluded)
    .filter((item) => new Date(item.startUtc as string).getTime() > now.getTime());

  return upcoming[0] ?? null;
};

/** 레일에서 NOW 라인이 들어갈 자리. 아직 아무것도 시작 안 했으면 0. */
export const getPassedItemCount = (items: HappyWeekItem[], now: Date) =>
  items.filter((item) => item.startUtc !== null && new Date(item.startUtc).getTime() <= now.getTime()).length;

/**
 * 마감. informational(액션이 아닌 것)과 로컬에서 숨긴 것을 걸러낸다.
 * 지난 마감은 삭제하지 않는다 — 실제로 처리했는지 앱은 알 수 없으므로
 * '완료됨'이라고 거짓말하지 않고 '지났음'으로 남긴다.
 */
export const getActionableDeadlines = (snapshot: HappyWeekSnapshot, dismissedIds: string[]): HappyWeekDeadline[] =>
  snapshot.deadlines
    .filter((deadline) => deadline.status === 'open')
    .filter((deadline) => !dismissedIds.includes(deadline.id))
    .sort((a, b) => a.dueUtc.localeCompare(b.dueUtc));

export const getDeadlinesDueOn = (snapshot: HappyWeekSnapshot, dateKey: string, dismissedIds: string[]): HappyWeekDeadline[] =>
  getActionableDeadlines(snapshot, dismissedIds).filter((deadline) => toCestDateKey(new Date(deadline.dueUtc)) === dateKey);

/** 아직 안 지난 마감 중 가장 이른 것 몇 개. 오늘 마감이 없어도 다가오는 건 보여야 한다. */
export const getUpcomingDeadlines = (snapshot: HappyWeekSnapshot, now: Date, dismissedIds: string[], limit = 3): HappyWeekDeadline[] =>
  getActionableDeadlines(snapshot, dismissedIds)
    .filter((deadline) => new Date(deadline.dueUtc).getTime() > now.getTime())
    .slice(0, limit);

export const getPastDueDeadlines = (snapshot: HappyWeekSnapshot, now: Date, dismissedIds: string[]): HappyWeekDeadline[] =>
  getActionableDeadlines(snapshot, dismissedIds).filter((deadline) => new Date(deadline.dueUtc).getTime() <= now.getTime());

/**
 * 그날 유효한 상비 카드.
 * offsetDays는 "그 날짜에 표시되면 이미 늦는" 항목을 앞당기기 위한 값이다.
 * (예: 일요일 주유소 휴무 → 전날에 미리 띄운다)
 */
export const getStandbyForDay = (snapshot: HappyWeekSnapshot, dateKey: string): HappyWeekStandby[] =>
  snapshot.standby
    .filter((standby) => {
      const from = addDaysToDateKey(standby.activeFrom, standby.offsetDays);
      const to = addDaysToDateKey(standby.activeTo, standby.offsetDays);
      return dateKey >= from && dateKey <= to;
    })
    .sort((a, b) => a.priority - b.priority);

/** scope.dateKeys가 비어 있으면 상시 연락처다. */
export const getContactsForDay = (snapshot: HappyWeekSnapshot, dateKey: string): HappyWeekContact[] =>
  snapshot.contacts.filter((contact) => contact.scope.dateKeys.length === 0 || contact.scope.dateKeys.includes(dateKey));

export const getGapsForDay = (snapshot: HappyWeekSnapshot, dateKey: string): HappyWeekGap[] =>
  snapshot.gaps.filter((gap) => gap.neededOnDate === dateKey).sort((a, b) => a.docOrder - b.docOrder);

/** 아직 안 채워진 것 전부. docOrder가 곧 작성자의 우선순위다. */
export const getOpenGaps = (snapshot: HappyWeekSnapshot): HappyWeekGap[] => [...snapshot.gaps].sort((a, b) => a.docOrder - b.docOrder);

export const getBrowseForCity = (snapshot: HappyWeekSnapshot, city: string | null): HappyWeekBrowseItem[] => {
  if (!city) return [];
  return snapshot.browse.filter((item) => item.city === city && item.category !== 'excluded');
};

/**
 * stayCity는 '돌로미티 서'처럼 세분화돼 있는데 browse의 city는 4개 도시로만 나뉜다.
 * 앞부분 일치로 잇는다.
 */
export const resolveBrowseCity = (snapshot: HappyWeekSnapshot, stayCity: string | null): string | null => {
  if (!stayCity) return null;

  const cities = Array.from(new Set(snapshot.browse.map((item) => item.city)));
  return cities.find((city) => stayCity.startsWith(city) || city.startsWith(stayCity)) ?? null;
};

/** 그날 앱을 열었을 때 severity가 가장 높은 것. 헤더 경고 판단에 쓴다. */
export const getDaySeverity = (items: HappyWeekItem[]): 'hard' | 'warn' | 'info' => {
  if (items.some((item) => item.severity === 'hard')) return 'hard';
  if (items.some((item) => item.severity === 'warn')) return 'warn';
  return 'info';
};
