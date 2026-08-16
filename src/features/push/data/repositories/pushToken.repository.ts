import { PushTokenEntity } from '@/features/push/types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { PushTokenRepository } from './pushToken.repository.types';

export const pushTokenRepository = getFirebaseRepositoryCreator('pushTokens')<PushTokenRepository>(({ db, auth, collectionName }) => {
  return {
    /**
     * 존재 여부를 먼저 읽지 않는다. 보안 규칙이 `resource.data.userId`를 검사하는데 아직 없는 문서는
     * `resource`가 null이라 read가 거부되고, 그러면 최초 토큰 등록이 항상 실패한다.
     * `merge: true` 쓰기는 문서가 없으면 create, 있으면 update로 평가되어 두 규칙 모두 통과한다.
     * 대신 `createdAt`은 "최근 등록 시각"의 의미가 된다.
     */
    upsert: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      await setDoc(doc(db, collectionName, payload.token), { ...payload, userId, createdAt: now, updatedAt: now }, { merge: true });
    },

    deleteByToken: async (token) => {
      await deleteDoc(doc(db, collectionName, token));
    },

    findByToken: async (token) => {
      const docSnap = await getDoc(doc(db, collectionName, token));
      if (!docSnap.exists()) return null;
      return serializeEntity<PushTokenEntity>({ id: docSnap.id, ...docSnap.data() });
    },
  };
});
