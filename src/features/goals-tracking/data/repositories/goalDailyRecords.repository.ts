import {
  GoalDailyRecordEntity,
  GoalDailyRecordsRepository,
} from '@/features/goals-tracking/data/repositories/goalDailyRecords.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';

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
  };
});
