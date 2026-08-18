import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { fetchOpenDates, fetchShowtimes, getScnYmdFromShowtimeKey, getShowtimeKey, toCgvNumber } from '../cgv/cgv.api';
import { checkMatchesDateFilters, checkMatchesShowtimeFilters } from '../cgv/cgv.filters';
import type { CgvOpenDate, CgvShowtime } from '../cgv/cgv.types';
import { CGV_COLLECTION } from '../firestore/collections';
import { checkIsScnYmd, formatScnYmd, formatShowtime } from '../lib/time.utils';
import { sendPushToUser } from '../push/sendPush';
import {
  CGV_MAX_WATCHED_DAYS,
  getCgvBookingLink,
  getCgvOpenLink,
  type CgvNotificationDraft,
  type CgvWatchDocument,
  type CgvWatchState,
} from '../types/cgvAlert.types';

/** 폴링 주기. 주기를 바꾸려면 이 값만 수정하고 재배포한다. */
const POLL_SCHEDULE = 'every 2 minutes';
/** 스케줄 해석 기준 타임존. */
const POLL_TIME_ZONE = 'Asia/Seoul';
/** 한 사이클에서 감시 항목 하나가 보낼 수 있는 알림 수 상한. 스펙 변경 등으로 폭주하는 상황을 막는다. */
const MAX_NOTIFICATIONS_PER_WATCH = 8;
/** 신규 회차 알림 본문에 나열할 회차 수. */
const MAX_LISTED_SHOWTIMES = 3;

type PollCycleContext = {
  now: Date;
  loadOpenDates: (siteNo: string) => Promise<CgvOpenDate[]>;
  loadShowtimes: (siteNo: string, scnYmd: string) => Promise<CgvShowtime[]>;
};

type MatchedShowtime = {
  scnYmd: string;
  key: string;
  showtime: CgvShowtime;
};

const EMPTY_STATE: Omit<CgvWatchState, 'watchId' | 'userId'> = {
  knownScnYmds: [],
  knownShowtimeKeys: [],
  soldOutShowtimeKeys: [],
  polledScnYmds: [],
  hasBaseline: false,
};

/**
 * 알림 상한을 넘겼을 때 남길 우선순위. 취소표는 몇 분 안에 사라지므로 가장 먼저 보내야 하고,
 * 예매 오픈은 하루 종일 유효하므로 잘려도 피해가 가장 작다.
 */
const DRAFT_PRIORITY: Record<CgvNotificationDraft['type'], number> = {
  SEAT_AVAILABLE: 0,
  NEW_SHOWTIME: 1,
  OPEN_DATE: 2,
};

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

/** Firestore 문서를 감시 항목으로 변환한다. 필수 필드가 비어 있으면 `null`을 반환해 건너뛴다. */
/** Firestore `Timestamp` 또는 `Date`를 `Date`로 정규화한다. */
const toDateOrNull = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return null;
};

const toWatchDocument = (id: string, data: Record<string, unknown>): CgvWatchDocument | null => {
  const { userId, siteNo, siteNm, triggers, filters } = data as Partial<CgvWatchDocument>;
  if (typeof userId !== 'string' || typeof siteNo !== 'string' || !Array.isArray(triggers) || triggers.length === 0 || !filters) {
    return null;
  }
  return {
    id,
    userId,
    enabled: true,
    siteNo,
    siteNm: typeof siteNm === 'string' ? siteNm : '',
    triggers,
    filters: {
      sscnsGradCds: toStringArray(filters.sscnsGradCds),
      movNo: typeof filters.movNo === 'string' ? filters.movNo : null,
      movNm: typeof filters.movNm === 'string' ? filters.movNm : null,
      dateRange: filters.dateRange ?? { type: 'ALL' },
      weekdays: Array.isArray(filters.weekdays) ? filters.weekdays.filter((day): day is number => typeof day === 'number') : [],
      timeRange: filters.timeRange ?? null,
    },
    updatedAt: toDateOrNull(data.updatedAt),
  };
};

/** 회차 표시용 라벨. `오디세이 · 11:00 · IMAX관` */
const getShowtimeLabel = (showtime: CgvShowtime): string => {
  const screenName = showtime.scnsNm || showtime.expoScnsNm || showtime.movkndDsplNm || '';
  return [showtime.movNm, formatShowtime(showtime.scnsrtTm), screenName].filter(Boolean).join(' · ');
};

/**
 * 회차 목록이 한 영화로 모아지면 그 `movNo`를 돌려준다. 섞여 있으면 `null`.
 * 딥링크를 영화별 예매로 보낼 수 있는지 판단하는 데 쓴다.
 */
const getSingleMovNo = (showtimes: CgvShowtime[]): string | null => {
  const movNos = new Set(showtimes.map((showtime) => showtime.movNo).filter(Boolean));
  return movNos.size === 1 ? (Array.from(movNos)[0] as string) : null;
};

/** 예매 오픈 알림 초안. 감시 조건에 영화가 걸려 있으면 그 영화로 좁혀 보낸다. */
const createOpenDateDraft = (watch: CgvWatchDocument, scnYmd: string): CgvNotificationDraft => ({
  type: 'OPEN_DATE',
  title: `${watch.siteNm || watch.siteNo} 예매 오픈`,
  body: `${formatScnYmd(scnYmd)} 상영 예매가 열렸어요.`,
  linkUrl: getCgvBookingLink({ siteNo: watch.siteNo, siteNm: watch.siteNm, scnYmd, movNo: watch.filters.movNo }),
  scnYmd,
});

/** 신규 회차 알림 초안. 같은 상영일의 신규 회차는 한 건으로 묶는다. */
const createNewShowtimeDraft = (watch: CgvWatchDocument, scnYmd: string, showtimes: CgvShowtime[]): CgvNotificationDraft => {
  const listed = showtimes.slice(0, MAX_LISTED_SHOWTIMES).map(getShowtimeLabel).join('\n');
  const rest = showtimes.length - Math.min(showtimes.length, MAX_LISTED_SHOWTIMES);
  // 묶인 회차가 여러 영화에 걸쳐 있으면 하나를 고를 수 없으므로 극장별 예매로 보낸다.
  const movNo = getSingleMovNo(showtimes) ?? watch.filters.movNo;
  return {
    type: 'NEW_SHOWTIME',
    title: `${watch.siteNm || watch.siteNo} 신규 회차 ${showtimes.length}건`,
    body: `${formatScnYmd(scnYmd)}\n${listed}${rest > 0 ? `\n외 ${rest}건` : ''}`,
    linkUrl: getCgvBookingLink({ siteNo: watch.siteNo, siteNm: watch.siteNm, scnYmd, movNo }),
    scnYmd,
  };
};

/** 취소표 알림 초안. 회차가 하나로 특정되므로 상영관/회차까지 딥링크에 실어 보낸다. */
const createSeatAvailableDraft = (
  watch: CgvWatchDocument,
  scnYmd: string,
  showtime: CgvShowtime,
  showtimeKey: string,
): CgvNotificationDraft => {
  const freeSeatCount = toCgvNumber(showtime.frSeatCnt) ?? 0;
  return {
    type: 'SEAT_AVAILABLE',
    title: `${watch.siteNm || watch.siteNo} 취소표 ${freeSeatCount}석`,
    body: `${formatScnYmd(scnYmd)} · ${getShowtimeLabel(showtime)}`,
    linkUrl: getCgvBookingLink({
      siteNo: watch.siteNo,
      siteNm: watch.siteNm,
      scnYmd,
      movNo: showtime.movNo,
      scnsNo: showtime.scnsNo,
      scnSseq: String(showtime.scnSseq),
    }),
    scnYmd,
    // 같은 날짜의 다른 회차 취소표 알림이 서로를 덮어쓰지 않도록 회차 키를 태그에 포함한다.
    tagSuffix: showtimeKey,
  };
};

/** 감시 항목이 이번 사이클에 조회할 상영일. 필터를 통과한 날짜 중 가까운 순으로 상한만큼 자른다. */
const selectTargetScnYmds = (openScnYmds: string[], watch: CgvWatchDocument, now: Date): string[] =>
  openScnYmds.filter((scnYmd) => checkMatchesDateFilters(scnYmd, watch.filters, now)).slice(0, CGV_MAX_WATCHED_DAYS);

/**
 * 감시 항목 하나를 처리해 발송할 알림 초안과 다음 상태를 만든다.
 * Firestore를 건드리지 않는 순수 로직이라 실제 CGV 응답만으로 단독 검증할 수 있다.
 */
export const runWatch = async (
  watch: CgvWatchDocument,
  previous: CgvWatchState | null,
  context: PollCycleContext,
): Promise<{ drafts: CgvNotificationDraft[]; nextState: Omit<CgvWatchState, 'watchId' | 'userId'> }> => {
  // 최초 폴링이면 알림 없이 기준선만 저장한다. (등록 직후 수십 건이 쏟아지는 것을 막는다)
  const isFirstPoll = previous === null || !previous.hasBaseline;
  const state = previous ?? { ...EMPTY_STATE, watchId: watch.id, userId: watch.userId };
  const drafts: CgvNotificationDraft[] = [];

  const openDates = await context.loadOpenDates(watch.siteNo);
  // 필터와 무관하게 극장이 연 날짜 전체를 기준선으로 삼아야 `WITHIN_DAYS`처럼 움직이는 필터에서 오탐이 나지 않는다.
  const fetchedScnYmds = Array.from(new Set(openDates.map((item) => item.scnYmd).filter(checkIsScnYmd))).sort();

  /**
   * CGV가 점검 등으로 빈 목록을 반환하는 경우가 있다. 그대로 기준선을 덮어쓰면 응답이 정상 복귀했을 때
   * 모든 날짜가 신규로 보여 가짜 예매 오픈 알림이 쏟아지므로, 이전 기준선을 유지하고 이번 사이클은 건너뛴다.
   */
  if (fetchedScnYmds.length === 0 && state.knownScnYmds.length > 0) {
    logger.warn('예매 가능일이 비어 있어 기준선을 유지합니다.', { watchId: watch.id, siteNo: watch.siteNo });
    return { drafts: [], nextState: { ...state, hasBaseline: true } };
  }
  const openScnYmds = fetchedScnYmds;

  if (watch.triggers.includes('OPEN_DATE') && !isFirstPoll) {
    const knownScnYmds = new Set(state.knownScnYmds);
    openScnYmds
      .filter((scnYmd) => !knownScnYmds.has(scnYmd) && checkMatchesDateFilters(scnYmd, watch.filters, context.now))
      .forEach((scnYmd) => drafts.push(createOpenDateDraft(watch, scnYmd)));
  }

  const needsShowtimes = watch.triggers.some((trigger) => trigger === 'NEW_SHOWTIME' || trigger === 'SEAT_AVAILABLE');
  if (!needsShowtimes) {
    return {
      drafts,
      nextState: { knownScnYmds: openScnYmds, knownShowtimeKeys: [], soldOutShowtimeKeys: [], polledScnYmds: [], hasBaseline: true },
    };
  }

  const targetScnYmds = selectTargetScnYmds(openScnYmds, watch, context.now);
  const matched: MatchedShowtime[] = [];
  for (const scnYmd of targetScnYmds) {
    const showtimes = await context.loadShowtimes(watch.siteNo, scnYmd);
    showtimes
      .filter((showtime) => checkMatchesShowtimeFilters(showtime, watch.filters))
      .forEach((showtime) => matched.push({ scnYmd, key: getShowtimeKey(scnYmd, showtime), showtime }));
  }

  const knownShowtimeKeys = new Set(state.knownShowtimeKeys);
  const soldOutShowtimeKeys = new Set(state.soldOutShowtimeKeys);
  /**
   * 회차 기준선이 잡힌 상영일. 상한(`CGV_MAX_WATCHED_DAYS`) 밖에 있다가 창 안으로 들어온 날짜나
   * 방금 예매가 열린 날짜는 회차 전체가 "신규"로 보이므로, 상영일 단위로도 기준선을 확인한다.
   *
   * 반드시 "조회한 날짜"(`polledScnYmds`)를 기준으로 삼아야 한다. 매칭된 회차 키에서 날짜를 뽑으면
   * 필터에 걸리는 회차가 0건이던 날짜는 기준선이 영원히 생기지 않아, 그 날짜에 조건에 맞는 회차가
   * 처음 편성되는 순간(사용자가 가장 원하는 이벤트)이 통째로 유실된다.
   * `polledScnYmds`가 없는 과거 문서는 기존 방식으로 대체해 마이그레이션 없이 동작하게 한다.
   */
  const baselinedScnYmds = new Set(
    state.polledScnYmds.length > 0 ? state.polledScnYmds : state.knownShowtimeKeys.map(getScnYmdFromShowtimeKey),
  );

  if (watch.triggers.includes('NEW_SHOWTIME') && !isFirstPoll) {
    const newByScnYmd = new Map<string, CgvShowtime[]>();
    matched
      .filter((item) => baselinedScnYmds.has(item.scnYmd) && !knownShowtimeKeys.has(item.key))
      .forEach((item) => newByScnYmd.set(item.scnYmd, [...(newByScnYmd.get(item.scnYmd) ?? []), item.showtime]));
    Array.from(newByScnYmd.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .forEach(([scnYmd, showtimes]) => drafts.push(createNewShowtimeDraft(watch, scnYmd, showtimes)));
  }

  if (watch.triggers.includes('SEAT_AVAILABLE') && !isFirstPoll) {
    matched
      .filter((item) => soldOutShowtimeKeys.has(item.key) && (toCgvNumber(item.showtime.frSeatCnt) ?? 0) > 0)
      .forEach((item) => drafts.push(createSeatAvailableDraft(watch, item.scnYmd, item.showtime, item.key)));
  }

  return {
    drafts,
    nextState: {
      knownScnYmds: openScnYmds,
      // 현재 응답에 존재하는 키만 남겨 상태 배열이 무한히 늘어나지 않게 한다.
      knownShowtimeKeys: matched.map((item) => item.key),
      soldOutShowtimeKeys: matched.filter((item) => (toCgvNumber(item.showtime.frSeatCnt) ?? 0) === 0).map((item) => item.key),
      polledScnYmds: targetScnYmds,
      hasBaseline: true,
    },
  };
};

/** 알림을 기록하고 푸시를 발송한다. 푸시가 실패해도 기록은 남긴다. */
const publishNotifications = async (watch: CgvWatchDocument, drafts: CgvNotificationDraft[]): Promise<void> => {
  const db = getFirestore();
  const now = Timestamp.now().toDate();

  for (const draft of drafts) {
    await db.collection(CGV_COLLECTION.notifications).add({
      userId: watch.userId,
      watchId: watch.id,
      type: draft.type,
      title: draft.title,
      body: draft.body,
      linkUrl: draft.linkUrl,
      siteNo: watch.siteNo,
      siteNm: watch.siteNm,
      scnYmd: draft.scnYmd,
      createdAt: now,
      updatedAt: now,
    });

    try {
      await sendPushToUser({
        userId: watch.userId,
        title: draft.title,
        body: draft.body,
        // 기록에는 CGV 주소를 그대로 남기고, 클릭 동선만 브리지 페이지를 거치게 한다.
        link: getCgvOpenLink({ bookingUrl: draft.linkUrl, title: draft.title, body: draft.body }),
        tag: [watch.id, draft.type, draft.scnYmd, draft.tagSuffix].filter(Boolean).join('-'),
      });
    } catch (error) {
      logger.error('푸시 발송 중 오류가 발생했습니다.', { watchId: watch.id, message: getErrorMessage(error) });
    }
  }
};

/** 폴링 사이클 1회. 스케줄러와 수동 실행에서 함께 쓴다. */
export const runPollCycle = async (): Promise<{ watchCount: number; notificationCount: number; failedWatchCount: number }> => {
  const db = getFirestore();
  const snapshot = await db.collection(CGV_COLLECTION.watches).where('enabled', '==', true).get();

  const watches = snapshot.docs
    .map((doc) => toWatchDocument(doc.id, doc.data()))
    .filter((watch): watch is CgvWatchDocument => watch !== null);

  if (watches.length === 0) {
    logger.info('활성화된 CGV 감시 항목이 없습니다.');
    return { watchCount: 0, notificationCount: 0, failedWatchCount: 0 };
  }

  // 같은 극장/날짜 응답은 사이클 내에서 재사용한다. 실패한 Promise도 그대로 캐시해 CGV에 재요청하지 않는다.
  const openDatesCache = new Map<string, Promise<CgvOpenDate[]>>();
  const showtimesCache = new Map<string, Promise<CgvShowtime[]>>();
  const context: PollCycleContext = {
    now: new Date(),
    loadOpenDates: (siteNo) => {
      const cached = openDatesCache.get(siteNo);
      if (cached) return cached;
      const request = fetchOpenDates(siteNo);
      openDatesCache.set(siteNo, request);
      return request;
    },
    loadShowtimes: (siteNo, scnYmd) => {
      const cacheKey = `${siteNo}|${scnYmd}`;
      const cached = showtimesCache.get(cacheKey);
      if (cached) return cached;
      const request = fetchShowtimes(siteNo, scnYmd);
      showtimesCache.set(cacheKey, request);
      return request;
    },
  };

  // 극장 단위로 묶어 `fetchOpenDates`가 극장당 1회만 나가도록 한다.
  const watchesBySite = new Map<string, CgvWatchDocument[]>();
  watches.forEach((watch) => watchesBySite.set(watch.siteNo, [...(watchesBySite.get(watch.siteNo) ?? []), watch]));

  let notificationCount = 0;
  let failedWatchCount = 0;

  for (const [siteNo, siteWatches] of watchesBySite) {
    for (const watch of siteWatches) {
      const stateRef = db.collection(CGV_COLLECTION.watchStates).doc(watch.id);
      try {
        const stateSnapshot = await stateRef.get();
        const stateData = stateSnapshot.data();
        /**
         * 감시 조건이 바뀐 뒤에도 예전 기준선을 쓰면, 필터를 넓히는 순간 기존 회차 수백 건이
         * 전부 "신규"로 잡혀 오탐이 쏟아진다. 수정 시각이 마지막 폴링보다 늦으면 기준선을 다시 잡는다.
         */
        const lastPolledAt = toDateOrNull(stateData?.lastPolledAt);
        const isStaleBaseline = lastPolledAt !== null && watch.updatedAt !== null && watch.updatedAt.getTime() > lastPolledAt.getTime();
        if (isStaleBaseline) {
          logger.info('감시 조건이 변경되어 기준선을 다시 잡습니다.', { watchId: watch.id });
        }

        const previous =
          stateSnapshot.exists && !isStaleBaseline
            ? ({
                watchId: watch.id,
                userId: watch.userId,
                knownScnYmds: toStringArray(stateData?.knownScnYmds),
                knownShowtimeKeys: toStringArray(stateData?.knownShowtimeKeys),
                soldOutShowtimeKeys: toStringArray(stateData?.soldOutShowtimeKeys),
                polledScnYmds: toStringArray(stateData?.polledScnYmds),
                hasBaseline: stateData?.hasBaseline === true,
              } satisfies CgvWatchState)
            : null;

        const { drafts, nextState } = await runWatch(watch, previous, context);
        // 상한에 걸려 잘릴 때 취소표처럼 시간에 민감한 알림이 먼저 살아남게 정렬한다.
        const prioritized = [...drafts].sort((left, right) => DRAFT_PRIORITY[left.type] - DRAFT_PRIORITY[right.type]);
        const limitedDrafts = prioritized.slice(0, MAX_NOTIFICATIONS_PER_WATCH);
        if (drafts.length > limitedDrafts.length) {
          logger.warn('알림이 상한을 초과해 일부만 발송합니다.', {
            watchId: watch.id,
            total: drafts.length,
            sent: limitedDrafts.length,
            droppedTypes: prioritized.slice(MAX_NOTIFICATIONS_PER_WATCH).map((draft) => draft.type),
          });
        }

        await stateRef.set(
          {
            watchId: watch.id,
            userId: watch.userId,
            ...nextState,
            lastPolledAt: Timestamp.now().toDate(),
            lastError: null,
          },
          { merge: false },
        );

        if (limitedDrafts.length > 0) {
          await publishNotifications(watch, limitedDrafts);
          notificationCount += limitedDrafts.length;
        }
      } catch (error) {
        // 감시 항목 하나가 실패해도 나머지는 계속 처리한다.
        failedWatchCount += 1;
        const message = getErrorMessage(error);
        logger.error('감시 항목 처리에 실패했습니다.', { watchId: watch.id, siteNo, message });
        // `lastPolledAt`은 일부러 갱신하지 않는다. 갱신하면 감시 조건 변경 감지(`isStaleBaseline`)가
        // 실패한 폴링 때문에 무력화되고, 기준선이 없는 상태에서 문서만 생기는 것을 `hasBaseline`이 막는다.
        await stateRef.set(
          {
            watchId: watch.id,
            userId: watch.userId,
            lastErrorAt: Timestamp.now().toDate(),
            lastError: message,
          },
          { merge: true },
        );
      }
    }
  }

  logger.info('CGV 폴링 사이클을 마쳤습니다.', {
    watchCount: watches.length,
    siteCount: watchesBySite.size,
    notificationCount,
    failedWatchCount,
  });

  return { watchCount: watches.length, notificationCount, failedWatchCount };
};

export const pollCgvWatches = onSchedule(
  {
    schedule: POLL_SCHEDULE,
    timeZone: POLL_TIME_ZONE,
    timeoutSeconds: 300,
    memory: '512MiB',
    // 사이클이 겹쳐 중복 알림이 나가지 않도록 동시 실행을 막는다.
    maxInstances: 1,
    retryCount: 0,
  },
  async () => {
    await runPollCycle();
  },
);
