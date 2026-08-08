import { FuelPaymentGroupEntity, FuelPaymentGroupsRepository, FuelPaymentRecord } from '@/features/fuel-payment/data/repositories';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { NotFoundError } from '@/lib';
import { toKstDateKey, toKstMidnightDate } from '@/lib/time.utils';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

const buildStoredRecord = (record: FuelPaymentRecord): FuelPaymentRecord => {
  const stored: FuelPaymentRecord = {
    date: toKstMidnightDate(record.date),
    userId: record.userId,
  };
  if (record.pricePerLiter && record.pricePerLiter > 0) stored.pricePerLiter = record.pricePerLiter;
  if (record.totalAmount && record.totalAmount > 0) stored.totalAmount = record.totalAmount;
  return stored;
};

export const fuelPaymentGroupsRepository = getFirebaseRepositoryCreator('fuelPaymentGroups')<FuelPaymentGroupsRepository>(({
  db,
  auth,
  collectionName,
}) => {
  const readGroup = async (groupId: string): Promise<FuelPaymentGroupEntity> => {
    const snap = await getDoc(doc(db, collectionName, groupId));
    if (!snap.exists()) throw new NotFoundError('그룹을 찾을 수 없습니다.');
    return serializeEntity<FuelPaymentGroupEntity>({ id: snap.id, ...(snap.data() as DocumentData) });
  };

  const writeRecords = async (groupId: string, records: FuelPaymentGroupEntity['records']) => {
    await updateDoc(doc(db, collectionName, groupId), {
      records,
      updatedAt: Timestamp.now().toDate(),
    });
  };

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

    findMyGroup: async () => {
      const userId = auth.currentUser!.uid;
      const q = query(collection(db, collectionName), where('userIds', 'array-contains', userId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return serializeEntity<FuelPaymentGroupEntity>({ id: docSnap.id, ...docSnap.data() });
    },

    addMember: async (groupId: string, userId: string) => {
      await updateDoc(doc(db, collectionName, groupId), { userIds: arrayUnion(userId) });
    },

    removeMember: async (groupId: string, userId: string) => {
      await updateDoc(doc(db, collectionName, groupId), { userIds: arrayRemove(userId) });
    },

    delete: async (groupId: string) => {
      await deleteDoc(doc(db, collectionName, groupId));
    },

    addRecord: async (groupId, record) => {
      const group = await readGroup(groupId);
      const storedRecord = buildStoredRecord(record);
      const normalizedKey = toKstDateKey(storedRecord.date);
      const nextRecords = [...group.records.filter((r) => toKstDateKey(r.date) !== normalizedKey), storedRecord];
      await writeRecords(groupId, nextRecords);
    },

    updateRecord: async (groupId, originalDate, record) => {
      const group = await readGroup(groupId);
      const originalKey = toKstDateKey(originalDate);
      const storedRecord = buildStoredRecord(record);
      const newKey = toKstDateKey(storedRecord.date);
      const nextRecords = [
        ...group.records.filter((r) => {
          const key = toKstDateKey(r.date);
          return key !== originalKey && key !== newKey;
        }),
        storedRecord,
      ];
      await writeRecords(groupId, nextRecords);
    },

    removeRecord: async (groupId, date) => {
      const group = await readGroup(groupId);
      const targetKey = toKstDateKey(toKstMidnightDate(date));
      const nextRecords = group.records.filter((r) => toKstDateKey(r.date) !== targetKey);
      if (nextRecords.length === group.records.length) return;
      await writeRecords(groupId, nextRecords);
    },
  };
});
