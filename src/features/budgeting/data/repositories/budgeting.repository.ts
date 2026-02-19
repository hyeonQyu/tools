import { BudgetingRepository } from '@/features/budgeting/data/repositories/budgeting.repository.types';
import { getFirebaseRepositoryCreator } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const DOCUMENT_ID = 'default';

export const budgetingRepository = getFirebaseRepositoryCreator('budgeting')<BudgetingRepository>(({ db, collectionName }) => {
  return {
    create: async (payload) => {
      const docRef = doc(db, collectionName, DOCUMENT_ID);
      const now = Date.now();
      await setDoc(docRef, { ...payload, id: DOCUMENT_ID, createdAt: now, updatedAt: now });
    },
    update: async (payload) => {
      const docRef = doc(db, collectionName, DOCUMENT_ID);
      const now = Date.now();
      await updateDoc(docRef, { ...payload, updatedAt: now });
    },
    exists: async () => {
      const docRef = doc(db, collectionName, DOCUMENT_ID);
      const snapshot = await getDoc(docRef);
      return snapshot.exists();
    },
  };
});
