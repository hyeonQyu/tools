import { DocumentEntity } from '@/firebase/entity.types';
import { firebase } from '@/firebase/firebase.config';
import { Auth } from 'firebase/auth';
import { DocumentData, Firestore } from 'firebase/firestore';

export const getFirebaseRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; auth: Auth; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebase.db, auth: firebase.auth, collectionName });
  };

export const serializeEntity = <T extends Record<string, unknown>>(data: DocumentData): DocumentEntity<T> => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
  } as DocumentEntity<T>;
};
