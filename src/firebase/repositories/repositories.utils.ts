import { firebase } from '@/firebase/firebase.config';
import { Firestore } from 'firebase/firestore';

export const getFirebaseClientRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebase.db, collectionName });
  };
