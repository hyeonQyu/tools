import { FuelPaymentGroupEntity, FuelPaymentGroupsRepository } from '@/features/fuel-payment/data/repositories';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

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
  };
});
