import { GoalEntity, GoalsRepository } from '@/features/goals-tracking/data/repositories/goals.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const goalsRepository = getFirebaseRepositoryCreator('goals')<GoalsRepository>(({ db, auth, collectionName }) => {
  return {
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();

      const goalEntity: Omit<GoalEntity, 'id'> = {
        ...payload,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      await addDoc(collection(db, collectionName), goalEntity);
    },

    findByName: async (name) => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId), where('name', '==', name));

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return serializeEntity<GoalEntity>({ id: doc.id, ...doc.data() });
    },
  };
});
