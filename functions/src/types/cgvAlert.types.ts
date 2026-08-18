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

/** 예매 딥링크가 가리킬 대상. 알림 종류에 따라 특정할 수 있는 범위가 달라 대부분이 선택 항목이다. */
export type CgvBookingLinkTarget = {
  siteNo: string;
  siteNm: string;
  /** `YYYYMMDD` */
  scnYmd?: string;
  /** 영화가 하나로 특정될 때만. 상영관/회차 파라미터는 이 값이 있어야 의미가 있다. */
  movNo?: string | null;
  scnsNo?: string | null;
  scnSseq?: string | null;
};

/**
 * 예매 페이지 딥링크.
 *
 * - `siteNm`을 함께 넘기지 않으면 극장이 선택되지 않은 화면이 열린다.
 * - 영화가 특정되면 **영화별 예매**(`/cnm/movieBook/movie`)로 보낸다. 극장별 예매(`/cnm/movieBook/cinema`)는
 *   그 극장의 모든 영화를 나열해서, 어떤 회차 때문에 알림이 왔는지 찾아야 한다.
 *   영화별 예매는 영화·극장·날짜가 모두 선택된 채로 그 영화의 회차만 보여준다. (실제 페이지로 확인)
 * - `scnsNo`/`scnSseq`는 페이지가 읽기는 하지만 첫 진입에서는 회차 강조까지 이어지지 않는다.
 *   무해하고 앱 쪽에서 쓰일 여지가 있어 회차가 특정될 때만 함께 넘긴다.
 * - `eventYn=Y`는 붙이지 말 것. 극장 선택이 풀리고 극장 선택 모달이 뜬 채로 열린다. (실측)
 */
export const getCgvBookingLink = ({ siteNo, siteNm, scnYmd, movNo, scnsNo, scnSseq }: CgvBookingLinkTarget): string => {
  const params = new URLSearchParams({ siteNo, siteNm });
  if (scnYmd) params.set('scnYmd', scnYmd);

  if (!movNo) return `https://cgv.co.kr/cnm/movieBook/cinema?${params.toString()}`;

  params.set('movNo', movNo);
  if (scnsNo) params.set('scnsNo', scnsNo);
  if (scnSseq) params.set('scnSseq', scnSseq);
  return `https://cgv.co.kr/cnm/movieBook/movie?${params.toString()}`;
};

/**
 * 알림 클릭 시 실제로 열리는 주소. CGV 예매 페이지로 바로 보내지 않고 앱 안의 브리지
 * 페이지(`public/cgv-open.html`)를 거친다. 거기서만 플랫폼별로 CGV 앱 실행을 시도하고
 * 실패 시 브라우저로 넘길 수 있기 때문이다. (서비스워커에서는 이 분기를 만들 수 없다)
 *
 * 상대 경로로 만들어 서비스워커가 자기 오리진 기준으로 해석하게 한다. 그래야 서버가
 * 배포 도메인을 알 필요가 없다.
 */
export const getCgvOpenLink = ({ bookingUrl, title, body }: { bookingUrl: string; title: string; body: string }): string =>
  `/cgv-open.html?${new URLSearchParams({ url: bookingUrl, t: title, b: body }).toString()}`;
