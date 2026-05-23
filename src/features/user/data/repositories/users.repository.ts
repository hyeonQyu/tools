import { UserEntity, UsersRepository } from '@/features/user/data/repositories/users.repository.types';
import { getFirebaseRepositoryCreator, serializeEntity } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export const usersRepository = getFirebaseRepositoryCreator('users')<UsersRepository>(({ db, collectionName }) => {
  return {
    findAll: async () => {
      const snapshot = await getDocs(query(collection(db, collectionName)));
      return snapshot.docs.map((doc) => serializeEntity<UserEntity>({ id: doc.id, ...doc.data() }));
    },
  };
});
