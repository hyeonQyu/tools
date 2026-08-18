import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { logger } from 'firebase-functions';
import { CGV_COLLECTION } from '../firestore/collections';

/** `sendEachForMulticast` 1회 호출당 토큰 상한. */
const MULTICAST_CHUNK_SIZE = 500;

/** 해당 토큰이 영구적으로 무효임을 뜻하는 FCM 에러 코드. 이 경우에만 `pushTokens`에서 삭제한다. */
const PERMANENT_TOKEN_ERROR_CODES = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);

export type SendPushParams = {
  userId: string;
  title: string;
  body: string;
  /** 알림 클릭 시 열릴 딥링크. */
  link: string;
  /** 같은 태그의 알림은 브라우저에서 하나로 합쳐진다. */
  tag?: string;
};

export type SendPushResult = {
  successCount: number;
  failureCount: number;
  removedTokenCount: number;
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

/**
 * 사용자의 모든 웹푸시 토큰으로 알림을 발송한다.
 * `pushTokens` 문서 id가 곧 FCM 토큰이므로, 영구 실패한 토큰은 문서째로 정리한다.
 */
export const sendPushToUser = async ({ userId, title, body, link, tag }: SendPushParams): Promise<SendPushResult> => {
  const db = getFirestore();
  const snapshot = await db.collection(CGV_COLLECTION.pushTokens).where('userId', '==', userId).get();

  // 문서 id가 곧 토큰이지만, 데이터의 `token` 필드가 다를 가능성에 대비해 삭제는 항상 문서 id로 한다.
  const entries = snapshot.docs
    .map((doc) => ({
      docId: doc.id,
      token: typeof doc.data().token === 'string' ? (doc.data().token as string) : doc.id,
      /** 워치 알림을 켠 기기. 알림 옵션이 달라져 다른 페이로드로 나간다. */
      watchAlert: doc.data().watchAlert === true,
    }))
    .filter((entry) => entry.token.length > 0);
  if (entries.length === 0) {
    logger.info('발송할 푸시 토큰이 없습니다.', { userId });
    return { successCount: 0, failureCount: 0, removedTokenCount: 0 };
  }

  const messaging = getMessaging();
  const invalidDocIds: string[] = [];
  let successCount = 0;
  let failureCount = 0;

  /**
   * 워치 알림 설정은 기기마다 다르고 알림 옵션(`watchAlert`)이 페이로드에 실리므로,
   * 설정이 같은 토큰끼리 묶어 두 번에 나눠 보낸다.
   */
  const entryGroups = [entries.filter((entry) => entry.watchAlert), entries.filter((entry) => !entry.watchAlert)].filter(
    (group) => group.length > 0,
  );

  for (const group of entryGroups) {
    for (const entryChunk of chunk(group, MULTICAST_CHUNK_SIZE)) {
      const response = await messaging.sendEachForMulticast({
        tokens: entryChunk.map((entry) => entry.token),
        // 데이터 전용 메시지로 보낸다. `notification`을 실으면 FCM SDK의 서비스워커가 알림을 먼저 자동 표시한 뒤
        // `onBackgroundMessage`까지 호출해 같은 알림이 2개 뜨고, SDK가 `notificationclick`을 선점한 채
        // 외부 도메인(cgv.co.kr) 링크를 차단해 버린다. 표시와 클릭 처리는 전부 우리 서비스워커가 담당한다.
        data: { title, body, link, ...(tag ? { tag } : {}), watchAlert: group[0].watchAlert ? '1' : '0' },
        webpush: {
          headers: { Urgency: 'high' },
        },
      });

      successCount += response.successCount;
      failureCount += response.failureCount;

      response.responses.forEach((result, index) => {
        if (result.success) return;
        const code = result.error?.code ?? '';
        if (PERMANENT_TOKEN_ERROR_CODES.has(code)) {
          invalidDocIds.push(entryChunk[index].docId);
          return;
        }
        logger.warn('푸시 발송 실패', { userId, code, message: result.error?.message });
      });
    }
  }

  if (invalidDocIds.length > 0) {
    const batch = db.batch();
    invalidDocIds.forEach((docId) => batch.delete(db.collection(CGV_COLLECTION.pushTokens).doc(docId)));
    await batch.commit();
    logger.info('만료된 푸시 토큰을 정리했습니다.', { userId, removedTokenCount: invalidDocIds.length });
  }

  return { successCount, failureCount, removedTokenCount: invalidDocIds.length };
};
