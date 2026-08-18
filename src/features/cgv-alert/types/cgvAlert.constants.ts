/**
 * 특별관 등급 코드. CGV가 등급 마스터 엔드포인트를 제공하지 않아
 * (`searchGradByRpsntGrad`는 빈 배열을 반환) 실제 응답에서 관측한 값을 상수로 고정한다.
 * 극장을 고르면 `getCgvSiteSpecialScreens` 응답으로 대체되므로 이 상수는 극장 선택 전 기본 목록이다.
 *
 * 주의: CGV는 특별관을 두 축으로 나눠 관리하며 아래 목록은 둘을 섞어 담고 있다.
 * - `TCSCNS_GRAD_CD`(기술): 02 4DX, 03 아이맥스, 04 SCREENX
 * - `SASCNS_GRAD_CD`(관 사양): 08 프리미엄관, 12 아트하우스
 * 그래서 서버의 필터는 두 축을 모두 비교한다(`functions/src/cgv/cgv.filters.ts`).
 * 코드 `07`은 두 축에서 의미가 달라(기술 DOLBY ATMOS / 사양 씨네앤포레) 의도보다 넓게 매칭될 수 있다.
 */
export const CGV_SPECIAL_SCREEN_GRADES = [
  { code: '03', name: 'IMAX' },
  { code: '02', name: '4DX' },
  { code: '04', name: 'SCREENX' },
  { code: '07', name: 'DOLBY ATMOS' },
  { code: '08', name: '프리미엄관' },
  { code: '12', name: '아트하우스' },
  { code: '01', name: '일반관' },
] as const;

export const CGV_TRIGGER_LABELS = {
  OPEN_DATE: '예매 오픈',
  NEW_SHOWTIME: '신규 회차',
  SEAT_AVAILABLE: '취소표',
} as const;

export const CGV_WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 감시 항목 하나가 조회할 수 있는 최대 상영일 수. CGV API 호출량을 제한하기 위한 상한. */
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
 * 예매 페이지 딥링크. 서버(`functions/src/types/cgvAlert.types.ts`)와 동일하게 유지한다.
 *
 * - `siteNm`을 함께 넘기지 않으면 극장이 선택되지 않은 화면이 열린다.
 * - 영화가 특정되면 영화별 예매(`/cnm/movieBook/movie`)로 보낸다. 영화·극장·날짜가 모두 선택된 채로
 *   그 영화의 회차만 보여 주므로, 극장의 모든 영화를 나열하는 극장별 예매보다 찾기 쉽다.
 * - `eventYn=Y`는 붙이지 말 것. 극장 선택이 풀린 채로 열린다.
 */
export const getCgvBookingLink = ({ siteNo, siteNm, scnYmd, movNo, scnsNo, scnSseq }: CgvBookingLinkTarget) => {
  const params = new URLSearchParams({ siteNo, siteNm });
  if (scnYmd) params.set('scnYmd', scnYmd);

  if (!movNo) return `https://cgv.co.kr/cnm/movieBook/cinema?${params.toString()}`;

  params.set('movNo', movNo);
  if (scnsNo) params.set('scnsNo', scnsNo);
  if (scnSseq) params.set('scnSseq', scnSseq);
  return `https://cgv.co.kr/cnm/movieBook/movie?${params.toString()}`;
};

/**
 * CGV 예매 주소를 여는 브리지 페이지(`public/cgv-open.html`) 주소.
 * 앱 안에서 CGV 링크를 그대로 열면 웹뷰(iOS는 로그아웃 상태)로 떨어지므로 항상 이 페이지를 거친다.
 */
export const getCgvOpenLink = ({ bookingUrl, title, body }: { bookingUrl: string; title: string; body: string }) =>
  `/cgv-open.html?${new URLSearchParams({ url: bookingUrl, t: title, b: body }).toString()}`;
