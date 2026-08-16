import { CgvNotificationEntity } from '@/features/cgv-alert/types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { CgvNotificationRepository } from './cgvNotification.repository.types';

export const cgvNotificationRepository = getFirebaseRepositoryCreator('cgvNotifications')<CgvNotificationRepository>(({
  db,
  auth,
  collectionName,
}) => {
  return {
    findAll: async (limitCount) => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => serializeEntity<CgvNotificationEntity>({ id: docSnap.id, ...docSnap.data() }));
    },
  };
});
