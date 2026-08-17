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

/** 예매 페이지 딥링크. `siteNm`을 함께 넘기지 않으면 극장이 선택되지 않은 화면이 열린다. */
export const getCgvBookingLink = ({ siteNo, siteNm, scnYmd }: { siteNo: string; siteNm: string; scnYmd?: string }) => {
  const params = new URLSearchParams({ siteNo, siteNm });
  if (scnYmd) params.set('scnYmd', scnYmd);
  return `https://cgv.co.kr/cnm/movieBook/cinema?${params.toString()}`;
};
