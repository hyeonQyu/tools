import { CgvWatchEntity } from '@/features/cgv-alert/types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { CgvWatchRepository } from './cgvWatch.repository.types';

export const cgvWatchRepository = getFirebaseRepositoryCreator('cgvWatches')<CgvWatchRepository>(({ db, auth, collectionName }) => {
  return {
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      await addDoc(collection(db, collectionName), { ...payload, userId, createdAt: now, updatedAt: now });
    },

    update: async (id, payload) => {
      await updateDoc(doc(db, collectionName, id), { ...payload, updatedAt: Timestamp.now().toDate() });
    },

    setEnabled: async (id, enabled) => {
      await updateDoc(doc(db, collectionName, id), { enabled, updatedAt: Timestamp.now().toDate() });
    },

    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },

    findAll: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => serializeEntity<CgvWatchEntity>({ id: docSnap.id, ...docSnap.data() }));
    },

    findById: async (id) => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return serializeEntity<CgvWatchEntity>({ id: docSnap.id, ...docSnap.data() });
    },
  };
});
