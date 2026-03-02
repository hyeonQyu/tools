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

export const serializeEntity = <T extends Record<string, unknown>>(data: DocumentData): DocumentEntity<T> =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, checkIsFirestoreTimestamp(value) ? value.toDate() : value]),
  ) as DocumentEntity<T>;
