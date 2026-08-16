import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';

/**
 * Cloud Functions 진입점.
 *
 * 리전은 클라이언트의 `CGV_FUNCTIONS_REGION`(`src/features/cgv-alert/data/cgvCatalog.api.ts`)과
 * **반드시 같아야 한다.** 다르면 콜러블 호출이 404로 실패한다. 바꿀 때는 양쪽을 함께 수정한다.
 */
const FUNCTIONS_REGION = 'asia-northeast3';

initializeApp();
setGlobalOptions({ region: FUNCTIONS_REGION, maxInstances: 10 });

export { getCgvCatalog, getCgvSiteSpecialScreens } from './callable/getCgvCatalog';
export { pollCgvWatches } from './scheduled/pollCgvWatches';
