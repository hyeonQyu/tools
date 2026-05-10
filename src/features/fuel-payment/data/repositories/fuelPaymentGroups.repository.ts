import { FuelPaymentGroupEntity, FuelPaymentGroupsRepository } from '@/features/fuel-payment/data/repositories';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { addDoc, collection, getDocs, query, Timestamp, where } from 'firebase/firestore';

export const fuelPaymentGroupsRepository = getFirebaseRepositoryCreator('fuelPaymentGroups')<FuelPaymentGroupsRepository>(({
  db,
  auth,
  collectionName,
}) => {
  return {
    create: async () => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      const entity: Omit<FuelPaymentGroupEntity, 'id'> = {
        userIds: [userId],
        records: [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, collectionName), entity);
      return serializeEntity<FuelPaymentGroupEntity>({ id: docRef.id, ...entity });
    },

    findMyGroup: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userIds', 'array-contains', userId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return serializeEntity<FuelPaymentGroupEntity>({ id: docSnap.id, ...docSnap.data() });
    },
  };
});
