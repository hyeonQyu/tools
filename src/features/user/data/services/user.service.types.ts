import { UserEntity, UsersRepository } from '@/features/user/data/repositories';

export interface UserService {
  getUsers: () => Promise<UserEntity[]>;
}

export interface UserServiceDependencies {
  usersRepository: UsersRepository;
}
