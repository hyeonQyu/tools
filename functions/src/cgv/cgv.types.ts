/**
 * CGV 내부 API 응답 타입. 공식 문서가 없어 실측 응답(`cgv-api-contract`) 기준으로 정의했다.
 * 숫자 필드도 문자열로 내려오는 경우가 있어 `string | number`로 받고 사용처에서 변환한다.
 */

export type CgvNumeric = string | number;

/** `searchAllRegionAndSite` */
export type CgvRegionInfo = {
  comCdval: string;
  comCdvalNm: string;
  cnt?: CgvNumeric;
};

export type CgvSiteInfo = {
  regnGrpCd: string;
  siteNo: string;
  siteNm: string;
};

export type CgvRegionAndSite = {
  regionInfo: CgvRegionInfo[];
  siteInfo: CgvSiteInfo[];
};

/** `searchSiteScnscYmdListBySite` */
export type CgvOpenDate = {
  /** `YYYYMMDD` */
  scnYmd: string;
  hldyYn?: string;
};

/** `searchMovScnInfo` */
export type CgvShowtime = {
  /** 사업장 번호. 같은 `siteNo` 응답에 다른 사업장(씨네드쉐프 등) 회차가 섞이므로 고유키에 반드시 포함한다. */
  bzplcNo: string;
  scnsNo: string;
  scnsNm?: string;
  expoScnsNm?: string;
  scnSseq: CgvNumeric;
  movNo: string;
  movNm: string;
  prodNo?: string;
  /** `HHmm`. 자정을 넘기면 `2445`처럼 24시 이상으로 표기된다. */
  scnsrtTm: string;
  scnendTm?: string;
  /** 상영 기술 등급 코드 (`TCSCNS_GRAD_CD`). 예: `02` 4DX, `03` 아이맥스, `04` SCREENX */
  tcscnsGradCd?: string;
  tcscnsGradNm?: string;
  /** 상영관 사양 등급 코드 (`SASCNS_GRAD_CD`). 예: `08` 프리미엄관, `12` 아트하우스 */
  sascnsGradCd?: string;
  sascnsGradNm?: string;
  movkndDsplNm?: string;
  /** 잔여 좌석 / 총 좌석 */
  frSeatCnt?: CgvNumeric;
  stcnt?: CgvNumeric;
  cntlYn?: string;
};

/** `searchSscnsSchdExistList` */
export type CgvSpecialScreenSchedule = {
  comCd?: string;
  comCdval: string;
  comCdvalNm: string;
  schdCnt?: CgvNumeric;
};

/** `searchAtktTopPostrList` */
export type CgvMovieItem = {
  movNo: string;
  movNm: string;
  cratgClsCd?: string;
  scnBssTm?: CgvNumeric;
  atktRate?: CgvNumeric;
};
