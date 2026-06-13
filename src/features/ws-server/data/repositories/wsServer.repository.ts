import { WsServerEntity } from '@/features/ws-server/types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { WsServerRepository } from './wsServer.repository.types';

export const wsServerRepository = getFirebaseRepositoryCreator('wsServers')<WsServerRepository>(({ db, auth, collectionName }) => {
  return {
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      await addDoc(collection(db, collectionName), { ...payload, userId, createdAt: now, updatedAt: now });
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
      return snapshot.docs.map((docSnap) => serializeEntity<WsServerEntity>({ id: docSnap.id, ...docSnap.data() }));
    },

    findById: async (id) => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return serializeEntity<WsServerEntity>({ id: docSnap.id, ...docSnap.data() });
    },

    findByUrl: async (url) => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId), where('url', '==', url));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return serializeEntity<WsServerEntity>({ id: docSnap.id, ...docSnap.data() });
    },
  };
});
