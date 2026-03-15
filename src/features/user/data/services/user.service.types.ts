import { UserPayload, UsersRepository } from '@/features/user/data/repositories';

export interface UserService {
  getUsers: () => Promise<UserPayload[]>;
}

export interface UserServiceDependencies {
  usersRepository: UsersRepository;
}
