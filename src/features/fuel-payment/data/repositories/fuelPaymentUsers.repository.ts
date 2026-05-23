import {
  FuelPaymentUserEntity,
  FuelPaymentUsersRepository,
} from '@/features/fuel-payment/data/repositories/fuelPaymentUsers.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

export const fuelPaymentUsersRepository = getFirebaseRepositoryCreator('fuelPaymentUsers')<FuelPaymentUsersRepository>(({
  db,
  collectionName,
}) => {
  return {
    upsert: async (id, payload) => {
      await setDoc(doc(db, collectionName, id), payload, { merge: true });
    },

    findByGroupId: async (groupId) => {
      const q = query(collection(db, collectionName), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => serializeEntity<FuelPaymentUserEntity>({ id: d.id, ...d.data() }));
    },

    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },
  };
});
