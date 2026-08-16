import { DaisoShoppingItemEntity } from '@/features/daiso-shopping/types';
import { omitUndefined } from '@/features/daiso-shopping/utils';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { DaisoShoppingItemsRepository } from './daisoShoppingItems.repository.types';

export const daisoShoppingItemsRepository = getFirebaseRepositoryCreator('daisoShoppingItems')<DaisoShoppingItemsRepository>(
  ({ db, auth, collectionName }) => ({
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      const entity = omitUndefined({ ...payload, userId, createdAt: now, updatedAt: now }) as Omit<DaisoShoppingItemEntity, 'id'>;
      const docRef = await addDoc(collection(db, collectionName), entity);
      return serializeEntity<DaisoShoppingItemEntity>({ id: docRef.id, ...entity });
    },

    update: async (id, payload) => {
      await updateDoc(doc(db, collectionName, id), omitUndefined({ ...payload, updatedAt: Timestamp.now().toDate() }));
    },

    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },

    findAll: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => serializeEntity<DaisoShoppingItemEntity>({ id: d.id, ...d.data() }));
    },
  }),
);
