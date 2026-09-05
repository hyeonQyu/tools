import { HappyWeekDocsResponse, happyWeekDocsResponseSchema } from '@/features/happy-week/types';
import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

/** 함수 배포 리전(`functions/src/index.ts`의 FUNCTIONS_REGION)과 반드시 같아야 한다. */
const HAPPY_WEEK_FUNCTIONS_REGION = 'asia-northeast3';

/**
 * 원본 문서 최신본을 받아온다. 이미 아는 SHA를 보내면 바뀐 문서만 돌아온다.
 * 이 호출은 오프라인에서 반드시 실패하며, 실패해도 앱은 스냅샷으로 계속 동작한다.
 */
export const fetchHappyWeekDocs = async (knownShas: Record<string, string>): Promise<HappyWeekDocsResponse> => {
  const callable = httpsCallable<{ knownShas: Record<string, string> }, unknown>(
    getFunctions(getApp(), HAPPY_WEEK_FUNCTIONS_REGION),
    'getHappyWeekDocs',
  );
  const { data } = await callable({ knownShas });
  return happyWeekDocsResponseSchema.parse(data);
};
