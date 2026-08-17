import { DaisoShoppingSettingsPayload } from '@/features/daiso-shopping/types';
import { omitUndefined } from '@/features/daiso-shopping/utils';
import { getFirebaseRepositoryCreator } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { DaisoShoppingSettingsRepository } from './daisoShoppingSettings.repository.types';

const INITIAL_SETTINGS: DaisoShoppingSettingsPayload = { stores: [], selectedStoreCode: null };

export const daisoShoppingSettingsRepository = getFirebaseRepositoryCreator('daisoShoppingSettings')<DaisoShoppingSettingsRepository>(({
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
      await setDoc(ref, INITIAL_SETTINGS);
    }
  };

  return {
    get: async () => {
      const snap = await getDoc(getDocRef());
      if (!snap.exists()) return null;
      return snap.data() as DaisoShoppingSettingsPayload;
    },

    saveStores: async (stores) => {
      await ensureExists();
      await updateDoc(getDocRef(), { stores: stores.map((store) => omitUndefined(store)) });
    },

    selectStore: async (storeCode) => {
      await ensureExists();
      await updateDoc(getDocRef(), { selectedStoreCode: storeCode });
    },
  };
});
