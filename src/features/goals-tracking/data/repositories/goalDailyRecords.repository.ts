import {
  GoalDailyRecordEntity,
  GoalDailyRecordsRepository,
} from '@/features/goals-tracking/data/repositories/goalDailyRecords.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { toKstMidnightDate } from '@/lib';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

export const goalDailyRecordsRepository = getFirebaseRepositoryCreator('goalDailyRecords')<GoalDailyRecordsRepository>(({
  db,
  auth,
  collectionName,
}) => {
  return {
    findByDate: async (date) => {
      const userId = auth.currentUser!.uid;
      const kstMidnightDate = toKstMidnightDate(date);

      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        where('date', '==', Timestamp.fromDate(kstMidnightDate)),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => serializeEntity<GoalDailyRecordEntity>({ id: docSnap.id, ...docSnap.data() }));
    },

    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      const normalizedDate = toKstMidnightDate(payload.date);

      const entity: Omit<GoalDailyRecordEntity, 'id'> = {
        ...payload,
        date: normalizedDate,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      await addDoc(collection(db, collectionName), entity);
    },

    delete: async ({ goalId, date }) => {
      const userId = auth.currentUser!.uid;
      const kstMidnightDate = toKstMidnightDate(date);

      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        where('goalId', '==', goalId),
        where('date', '==', Timestamp.fromDate(kstMidnightDate)),
      );

      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, collectionName, docSnap.id)));
      await Promise.all(deletePromises);
    },
  };
});
