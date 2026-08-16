/**
 * Firestore에 저장되는 CGV 알림 도메인 타입.
 *
 * 원본(단일 진실 공급원)은 클라이언트의 `src/features/cgv-alert/types/*` 이지만,
 * `functions/`는 별도 빌드 타깃(CommonJS, Node)이고 클라이언트 타입이 `firebase/app`·`zod`에
 * 의존하고 있어 직접 import 할 수 없다. **필드 이름/형태를 바꿀 때는 반드시 양쪽을 함께 수정한다.**
 */

export type CgvTriggerType = 'OPEN_DATE' | 'NEW_SHOWTIME' | 'SEAT_AVAILABLE';

export type CgvDateRange = { type: 'ALL' } | { type: 'WITHIN_DAYS'; days: number } | { type: 'RANGE'; from: string; to: string };

/** `HHmm`. 상영 시작 시각 기준으로 비교한다. */
export type CgvTimeRange = { startTm: string; endTm: string };

/** 빈 배열/`null`은 "제한 없음"을 뜻한다. */
export type CgvWatchFilter = {
  sscnsGradCds: string[];
  movNo: string | null;
  movNm: string | null;
  dateRange: CgvDateRange;
  weekdays: number[];
  timeRange: CgvTimeRange | null;
};

export type CgvWatchDocument = {
  id: string;
  userId: string;
  enabled: boolean;
  siteNo: string;
  siteNm: string;
  triggers: CgvTriggerType[];
  filters: CgvWatchFilter;
  /** 감시 조건이 바뀌었는지 판단해 기준선을 다시 잡는 데 쓴다. 과거 문서에는 없을 수 있어 nullable. */
  updatedAt: Date | null;
};

export type CgvWatchState = {
  watchId: string;
  userId: string;
  knownScnYmds: string[];
  knownShowtimeKeys: string[];
  soldOutShowtimeKeys: string[];
  /**
   * 이번 사이클에 실제로 회차를 조회한 상영일.
   * `knownShowtimeKeys`는 필터를 통과한 회차만 담으므로, "조회했지만 매칭이 0건이던 날짜"를
   * "아직 조회한 적 없는 날짜"와 구분하려면 별도로 기록해야 한다.
   * 이게 없으면 그 날짜에 조건에 맞는 회차가 처음 생기는 순간이 기준선 미형성으로 판단되어 영원히 알림되지 않는다.
   */
  polledScnYmds: string[];
  /**
   * 정상 폴링으로 기준선이 만들어졌는지. 폴링 실패 시에도 `lastError`를 남기려고 문서를 만들기 때문에,
   * 문서 존재 여부만으로는 최초 폴링을 판별할 수 없다.
   */
  hasBaseline: boolean;
};

export type CgvNotificationDraft = {
  type: CgvTriggerType;
  title: string;
  body: string;
  linkUrl: string;
  /** `YYYYMMDD` */
  scnYmd: string;
  /**
   * 같은 알림이 중복 표시되지 않도록 브라우저에 넘기는 식별자.
   * 같은 날짜라도 회차가 다르면 서로 덮어쓰면 안 되므로 회차 단위 알림은 회차 키까지 포함한다.
   */
  tagSuffix?: string;
};

/** 감시 항목 하나가 조회할 수 있는 최대 상영일 수. CGV 호출량 상한. */
export const CGV_MAX_WATCHED_DAYS = 14;

/** 예매 페이지 딥링크. `siteNm`을 함께 넘기지 않으면 극장이 선택되지 않은 화면이 열린다. */
export const getCgvBookingLink = ({ siteNo, siteNm, scnYmd }: { siteNo: string; siteNm: string; scnYmd?: string }): string => {
  const params = new URLSearchParams({ siteNo, siteNm });
  if (scnYmd) params.set('scnYmd', scnYmd);
  return `https://cgv.co.kr/cnm/movieBook/cinema?${params.toString()}`;
};
