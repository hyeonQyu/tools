import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { BudgetingPresetEntity, BudgetingPresetRepository } from './budgeting.preset.repository.types';

export const budgetingPresetRepository = getFirebaseRepositoryCreator('budgeting-presets')<BudgetingPresetRepository>(({
  db,
  auth,
  collectionName,
}) => {
  return {
    create: async (payload) => {
      const userId = auth.currentUser!.uid;
      const now = Timestamp.now().toDate();
      const ref = await addDoc(collection(db, collectionName), { ...payload, userId, createdAt: now, updatedAt: now });
      return ref.id;
    },
    findAll: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => serializeEntity<BudgetingPresetEntity>({ id: docSnap.id, ...docSnap.data() }));
    },
    findByName: async (name) => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userId', '==', userId), where('name', '==', name));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return serializeEntity<BudgetingPresetEntity>({ id: docSnap.id, ...docSnap.data() });
    },
    rename: async (id, name) => {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { name, updatedAt: Timestamp.now().toDate() });
    },
    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },
  };
});
