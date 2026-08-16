import type { CgvMovieItem, CgvOpenDate, CgvRegionAndSite, CgvShowtime, CgvSpecialScreenSchedule } from './cgv.types';

/**
 * CGV 내부 API 클라이언트.
 *
 * - CORS를 허용하지 않아 브라우저에서 직접 호출할 수 없다. 반드시 서버에서만 호출한다.
 * - Cloudflare가 curl류 클라이언트를 403으로 막지만 Node의 native fetch는 브라우저 UA/Referer만 붙이면 통과한다.
 *   별도 우회 라이브러리를 쓰지 않는다.
 * - 공식 API가 아니므로 스펙 변경 시 깨질 수 있다. 실패를 조용히 삼키지 말고 항상 예외로 드러낸다.
 */

const CGV_API_BASE = 'https://cgv.co.kr/api/v1';
const CGV_CO_CD = 'A420';
/** 발매통제범위코드. `searchMovScnInfo`의 필수 파라미터로, 빠지면 400이 떨어진다. */
const CGV_RTCTL_SCOP_CD = '08';
const CGV_REQUEST_TIMEOUT_MS = 10_000;

const CGV_REQUEST_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  Referer: 'https://cgv.co.kr/cnm/movieBook/cinema',
};

export class CgvApiError extends Error {
  constructor(
    message: string,
    readonly path: string,
  ) {
    super(message);
    this.name = 'CgvApiError';
  }
}

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

const checkIsRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const requestCgv = async <TData>(path: string, params: Record<string, string> = {}): Promise<TData> => {
  const url = new URL(`${CGV_API_BASE}${path}`);
  url.searchParams.set('coCd', CGV_CO_CD);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  let response: Response;
  try {
    response = await fetch(url, {
      headers: CGV_REQUEST_HEADERS,
      signal: AbortSignal.timeout(CGV_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new CgvApiError(`CGV 요청에 실패했습니다: ${getErrorMessage(error)}`, path);
  }

  if (!response.ok) {
    throw new CgvApiError(`CGV가 HTTP ${response.status}를 반환했습니다.`, path);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new CgvApiError(`CGV 응답을 JSON으로 파싱하지 못했습니다: ${getErrorMessage(error)}`, path);
  }

  if (!checkIsRecord(body) || !('statusCode' in body)) {
    throw new CgvApiError('CGV 응답 봉투 형식이 예상과 다릅니다.', path);
  }

  const { statusCode, statusMessage, data } = body as { statusCode: unknown; statusMessage?: unknown; data?: unknown };
  if (Number(statusCode) !== 0) {
    throw new CgvApiError(`CGV가 오류를 반환했습니다 (statusCode=${String(statusCode)}): ${String(statusMessage ?? '')}`, path);
  }
  if (data === undefined || data === null) {
    throw new CgvApiError('CGV 응답에 data가 없습니다.', path);
  }

  return data as TData;
};

const assertArray = (value: unknown, path: string): unknown[] => {
  if (!Array.isArray(value)) throw new CgvApiError('CGV 응답 data가 배열이 아닙니다.', path);
  return value;
};

/** 극장별 예매 가능 상영일 목록. 예매 오픈 감지의 핵심으로, 극장당 1회 호출로 끝난다. */
export const fetchOpenDates = async (siteNo: string): Promise<CgvOpenDate[]> => {
  const path = '/booking/searchSiteScnscYmdListBySite';
  const data = await requestCgv<unknown>(path, { siteNo });
  return assertArray(data, path)
    .filter(checkIsRecord)
    .map((item) => ({
      scnYmd: String(item.scnYmd ?? ''),
      hldyYn: item.hldyYn === undefined ? undefined : String(item.hldyYn),
    }));
};

/** 특정 극장/날짜의 회차 목록. `rtctlScopCd`는 필수 파라미터다. */
export const fetchShowtimes = async (siteNo: string, scnYmd: string): Promise<CgvShowtime[]> => {
  const path = '/booking/searchMovScnInfo';
  const data = await requestCgv<unknown>(path, { siteNo, scnYmd, rtctlScopCd: CGV_RTCTL_SCOP_CD });
  return assertArray(data, path).filter(checkIsRecord) as unknown as CgvShowtime[];
};

/** 지역 + 극장 목록. */
export const fetchRegionsAndSites = async (): Promise<CgvRegionAndSite> => {
  const path = '/content/site/searchAllRegionAndSite';
  const data = await requestCgv<unknown>(path);
  if (!checkIsRecord(data)) throw new CgvApiError('CGV 극장 목록 응답 형식이 예상과 다릅니다.', path);
  return {
    regionInfo: assertArray(data.regionInfo ?? [], path).filter(checkIsRecord) as unknown as CgvRegionAndSite['regionInfo'],
    siteInfo: assertArray(data.siteInfo ?? [], path).filter(checkIsRecord) as unknown as CgvRegionAndSite['siteInfo'],
  };
};

/** 영화 목록 (셀렉터용). */
export const fetchMovies = async (): Promise<CgvMovieItem[]> => {
  const path = '/booking/searchAtktTopPostrList';
  const data = await requestCgv<unknown>(path, { movNm: '', div: '', attrCd: '' });
  return assertArray(data, path).filter(checkIsRecord) as unknown as CgvMovieItem[];
};

/** 특정 극장/날짜에 실제 스케줄이 있는 특별관 등급 목록. */
export const fetchSiteSpecialScreens = async (siteNo: string, scnYmd: string): Promise<CgvSpecialScreenSchedule[]> => {
  const path = '/booking/searchSscnsSchdExistList';
  const data = await requestCgv<unknown>(path, { siteNo, scnYmd });
  return assertArray(data, path).filter(checkIsRecord) as unknown as CgvSpecialScreenSchedule[];
};

/** 회차 고유키. `bzplcNo`를 빼면 같은 `siteNo` 응답에 섞여 오는 다른 사업장 회차와 충돌한다. */
export const getShowtimeKey = (scnYmd: string, showtime: CgvShowtime): string =>
  [scnYmd, showtime.bzplcNo, showtime.scnsNo, showtime.scnSseq].join('|');

/** 회차 고유키에서 상영일만 뽑는다. */
export const getScnYmdFromShowtimeKey = (key: string): string => key.split('|')[0] ?? '';

/** 문자열/숫자로 섞여 오는 수치 필드를 숫자로 변환한다. 변환 불가면 `null`. */
export const toCgvNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
