import { ExpirationDateSettingsPayload } from '@/features/expiration-dates/types';
import { getFirebaseRepositoryCreator } from '@/firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ExpirationDateSettingsRepository } from './expirationDateSettings.repository.types';

export const expirationDateSettingsRepository = getFirebaseRepositoryCreator('expirationDateSettings')<ExpirationDateSettingsRepository>(({
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
      const initial: ExpirationDateSettingsPayload = { locations: [], tags: [] };
      await setDoc(ref, initial);
    }
  };

  return {
    get: async () => {
      const snap = await getDoc(getDocRef());
      if (!snap.exists()) return null;
      return snap.data() as ExpirationDateSettingsPayload;
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
