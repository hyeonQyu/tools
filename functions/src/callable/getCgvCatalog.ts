import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { fetchMovies, fetchRegionsAndSites, fetchSiteSpecialScreens } from '../cgv/cgv.api';
import { CGV_COLLECTION } from '../firestore/collections';
import { getKstTodayYmd } from '../lib/time.utils';

/**
 * 브라우저에서 CGV API를 직접 호출할 수 없어(CORS 미허용) 극장/영화 목록을 이 콜러블로 중계한다.
 * 반환 형태는 클라이언트의 `CgvCatalog`(`src/features/cgv-alert/types/cgvCatalog.types.ts`)와 정확히 일치해야 한다.
 */

type CgvRegion = { regnGrpCd: string; regnGrpNm: string };
type CgvSite = { regnGrpCd: string; siteNo: string; siteNm: string };
type CgvMovie = { movNo: string; movNm: string };
type CgvCatalog = { regions: CgvRegion[]; sites: CgvSite[]; movies: CgvMovie[] };
type CgvSiteSpecialScreen = { code: string; name: string };

/** 극장 목록은 거의 바뀌지 않는다. */
const SITES_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
/** 영화 목록은 개봉/종영으로 자주 바뀐다. */
const MOVIES_CACHE_TTL_MS = 60 * 60 * 1000;
/** 극장별 특별관은 함수 인스턴스 메모리에만 짧게 캐시한다. */
const SPECIAL_SCREEN_CACHE_TTL_MS = 30 * 60 * 1000;

const SITES_CACHE_DOC_ID = 'sites';
const MOVIES_CACHE_DOC_ID = 'movies';

const specialScreenCache = new Map<string, { expiresAt: number; value: CgvSiteSpecialScreen[] }>();

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

const toDate = (value: unknown): Date | null => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
};

const assertAuthenticated = (uid: string | undefined): string => {
  if (!uid) throw new HttpsError('unauthenticated', '인증이 필요합니다.');
  return uid;
};

/**
 * Firestore 캐시를 읽고, 만료됐으면 CGV에서 새로 받아 갱신한다.
 * CGV 호출이 실패했는데 만료된 캐시라도 남아 있으면 그것을 쓴다(목록이 잠깐 낡는 편이 화면이 비는 것보다 낫다).
 */
const readCachedCatalogPart = async <TValue>({
  docId,
  ttlMs,
  fetchValue,
  parseCache,
}: {
  docId: string;
  ttlMs: number;
  fetchValue: () => Promise<TValue>;
  parseCache: (data: Record<string, unknown>) => TValue | null;
}): Promise<TValue> => {
  const db = getFirestore();
  const cacheRef = db.collection(CGV_COLLECTION.catalogCache).doc(docId);
  const snapshot = await cacheRef.get();
  const data = snapshot.exists ? (snapshot.data() ?? {}) : {};
  const cachedValue = snapshot.exists ? parseCache(data) : null;
  const updatedAt = toDate(data.updatedAt);

  const isFresh = cachedValue !== null && updatedAt !== null && Date.now() - updatedAt.getTime() < ttlMs;
  if (isFresh) return cachedValue;

  try {
    const value = await fetchValue();
    await cacheRef.set({ ...(value as object), updatedAt: Timestamp.now().toDate() }, { merge: false });
    return value;
  } catch (error) {
    if (cachedValue !== null) {
      logger.warn('CGV 목록 갱신에 실패해 만료된 캐시를 사용합니다.', { docId, message: getErrorMessage(error) });
      return cachedValue;
    }
    throw new HttpsError('unavailable', `CGV 목록을 불러오지 못했습니다: ${getErrorMessage(error)}`);
  }
};

const readSitesCatalog = () =>
  readCachedCatalogPart<{ regions: CgvRegion[]; sites: CgvSite[] }>({
    docId: SITES_CACHE_DOC_ID,
    ttlMs: SITES_CACHE_TTL_MS,
    parseCache: (data) => {
      const regions = data.regions;
      const sites = data.sites;
      if (!Array.isArray(regions) || !Array.isArray(sites) || sites.length === 0) return null;
      return { regions: regions as CgvRegion[], sites: sites as CgvSite[] };
    },
    fetchValue: async () => {
      const { regionInfo, siteInfo } = await fetchRegionsAndSites();
      return {
        // CGV는 지역을 공통코드 형태(`comCdval`/`comCdvalNm`)로 내려준다. 극장의 `regnGrpCd`와 이어붙이기 위해 이름을 맞춘다.
        regions: regionInfo.map((region) => ({ regnGrpCd: String(region.comCdval), regnGrpNm: String(region.comCdvalNm) })),
        sites: siteInfo.map((site) => ({
          regnGrpCd: String(site.regnGrpCd),
          siteNo: String(site.siteNo),
          siteNm: String(site.siteNm),
        })),
      };
    },
  });

const readMoviesCatalog = () =>
  readCachedCatalogPart<{ movies: CgvMovie[] }>({
    docId: MOVIES_CACHE_DOC_ID,
    ttlMs: MOVIES_CACHE_TTL_MS,
    parseCache: (data) => (Array.isArray(data.movies) ? { movies: data.movies as CgvMovie[] } : null),
    fetchValue: async () => {
      const movies = await fetchMovies();
      return { movies: movies.map((movie) => ({ movNo: String(movie.movNo), movNm: String(movie.movNm) })) };
    },
  });

/** 감시 항목 등록 화면에서 쓰는 지역/극장/영화 목록. */
export const getCgvCatalog = onCall(async (request): Promise<CgvCatalog> => {
  assertAuthenticated(request.auth?.uid);

  const [{ regions, sites }, { movies }] = await Promise.all([readSitesCatalog(), readMoviesCatalog()]);
  return { regions, sites, movies };
});

/**
 * 특정 극장에서 실제 운영 중인 특별관 등급.
 * 오늘 스케줄이 없어 빈 배열이 오면 그대로 빈 배열을 돌려준다(클라이언트가 전체 등급 상수로 대체할 수 있다).
 */
export const getCgvSiteSpecialScreens = onCall<{ siteNo?: unknown }>(async (request): Promise<CgvSiteSpecialScreen[]> => {
  assertAuthenticated(request.auth?.uid);

  const siteNo = typeof request.data?.siteNo === 'string' ? request.data.siteNo.trim() : '';
  if (!siteNo) throw new HttpsError('invalid-argument', 'siteNo가 필요합니다.');

  const cached = specialScreenCache.get(siteNo);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const schedules = await fetchSiteSpecialScreens(siteNo, getKstTodayYmd());
    // 응답에는 상영 기술 축(`TCSCNS_GRAD_CD`)과 상영관 사양 축(`SASCNS_GRAD_CD`)이 함께 들어온다.
    // 폴링 필터가 두 축을 모두 대조하므로 여기서도 두 축을 그대로 노출한다. 코드가 겹치면 먼저 온 쪽을 쓴다.
    const value = Array.from(
      new Map(
        schedules.map((schedule) => [String(schedule.comCdval), { code: String(schedule.comCdval), name: String(schedule.comCdvalNm) }]),
      ).values(),
    );
    specialScreenCache.set(siteNo, { expiresAt: Date.now() + SPECIAL_SCREEN_CACHE_TTL_MS, value });
    return value;
  } catch (error) {
    throw new HttpsError('unavailable', `특별관 목록을 불러오지 못했습니다: ${getErrorMessage(error)}`);
  }
});
