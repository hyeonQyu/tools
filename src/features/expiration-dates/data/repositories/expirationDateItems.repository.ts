import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ExpirationDateItemsRepository } from './expirationDateItems.repository.types';

export const expirationDateItemsRepository = getFirebaseRepositoryCreator('expirationDateItems')<ExpirationDateItemsRepository>(
  ({ db, auth, collectionName }) => ({
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      const entity: Omit<ExpirationDateItemEntity, 'id'> = { ...payload, userId, createdAt: now, updatedAt: now };
      const docRef = await addDoc(collection(db, collectionName), entity);
      return serializeEntity<ExpirationDateItemEntity>({ id: docRef.id, ...entity });
    },

    update: async (id, payload) => {
      await updateDoc(doc(db, collectionName, id), { ...payload, updatedAt: Timestamp.now().toDate() });
    },

    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },

    findAll: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => serializeEntity<ExpirationDateItemEntity>({ id: d.id, ...d.data() }));
    },
  }),
);
