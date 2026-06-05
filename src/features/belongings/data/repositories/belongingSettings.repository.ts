import { BelongingSettingsPayload } from '@/features/belongings/types';
import { getFirebaseRepositoryCreator } from '@/firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BelongingSettingsRepository } from './belongingSettings.repository.types';

export const belongingSettingsRepository = getFirebaseRepositoryCreator('belongingSettings')<BelongingSettingsRepository>(({
  db,
  auth,
  collectionName,
}) => {
  const getDocRef = () => {
    const userId = auth.currentUser!.uid;
    return doc(db, collectionName, userId);
  };

  const ensureExists = async () => {
    const ref = getDocRef();
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const initial: BelongingSettingsPayload = { locations: [], tags: [] };
      await setDoc(ref, initial);
    }
  };

  return {
    get: async () => {
      const snap = await getDoc(getDocRef());
      if (!snap.exists()) return null;
      return snap.data() as BelongingSettingsPayload;
    },

    addLocation: async (location) => {
      await ensureExists();
      await updateDoc(getDocRef(), { locations: arrayUnion(location) });
    },

    addTag: async (tag) => {
      await ensureExists();
      await updateDoc(getDocRef(), { tags: arrayUnion(tag) });
    },
  };
});
