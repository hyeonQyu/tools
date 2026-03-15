import { BudgetingPayload, BudgetingRepository } from '@/features/budgeting/data/repositories/budgeting.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { NotFoundError } from '@/lib';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const budgetingRepository = getFirebaseRepositoryCreator('budgeting')<BudgetingRepository>(({ db, auth, collectionName }) => {
  const userId = auth.currentUser!.uid;

  return {
    create: async (payload) => {
      const docRef = doc(db, collectionName, userId);
      const now = Date.now();
      await setDoc(docRef, { ...payload, id: userId, createdAt: now, updatedAt: now });
    },
    update: async (payload) => {
      const docRef = doc(db, collectionName, userId);
      const now = Date.now();
      await updateDoc(docRef, { ...payload, updatedAt: now });
    },
    read: async () => {
      const docRef = doc(db, collectionName, userId);
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();
      if (!data) {
        throw new NotFoundError('예산 데이터를 찾을 수 없습니다.');
      }
      return serializeEntity<BudgetingPayload>(data);
    },
    exists: async () => {
      const docRef = doc(db, collectionName, userId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists();
    },
  };
});
