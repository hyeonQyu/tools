import { DocumentEntity } from '@/firebase';

export type UserPayload = {
  name: string;
};

export type UserEntity = DocumentEntity<UserPayload>;

export interface UsersRepository {
  findAll: () => Promise<UserEntity[]>;
}
