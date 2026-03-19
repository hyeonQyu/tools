import { UserService, UserServiceDependencies } from '@/features/user/data/services/user.service.types';
import { getServiceCreator } from '@/firebase';

export const createUserService = getServiceCreator<UserService, UserServiceDependencies>(({ usersRepository }) => {
  return {
    getUsers: async () => {
      return usersRepository.findAll();
    },
  };
});
