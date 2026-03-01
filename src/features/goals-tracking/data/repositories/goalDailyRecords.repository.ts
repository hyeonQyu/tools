import {
  GoalDailyRecordEntity,
  GoalDailyRecordsRepository,
} from '@/features/goals-tracking/data/repositories/goalDailyRecords.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

export const goalDailyRecordsRepository = getFirebaseRepositoryCreator('goalDailyRecords')<GoalDailyRecordsRepository>(({
  db,
  auth,
  collectionName,
}) => {
  return {
    findByDate: async (date) => {
      const userId = auth.currentUser!.uid;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => serializeEntity<GoalDailyRecordEntity>({ id: docSnap.id, ...docSnap.data() }));
    },

    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();

      const entity: Omit<GoalDailyRecordEntity, 'id'> = {
        ...payload,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      await addDoc(collection(db, collectionName), entity);
    },

    delete: async ({ goalId, date }) => {
      const userId = auth.currentUser!.uid;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        where('goalId', '==', goalId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
      );

      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, collectionName, docSnap.id)));
      await Promise.all(deletePromises);
    },
  };
});
