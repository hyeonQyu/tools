import { DocumentEntity } from '@/firebase/entity.types';
import { firebase } from '@/firebase/firebase.config';
import { Auth } from 'firebase/auth';
import { DocumentData, Firestore } from 'firebase/firestore';

export const getFirebaseRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; auth: Auth; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebase.db, auth: firebase.auth, collectionName });
  };

const checkIsFirestoreTimestamp = (value: unknown): value is { toDate: () => Date } =>
  value != null && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function';

const deserializeValue = (value: unknown): unknown => {
  if (checkIsFirestoreTimestamp(value)) return value.toDate();
  if (Array.isArray(value)) return value.map(deserializeValue);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, v]) => [key, deserializeValue(v)]));
  }
  return value;
};

export const serializeEntity = <T extends Record<string, unknown>>(data: DocumentData): DocumentEntity<T> =>
  deserializeValue(data) as DocumentEntity<T>;
