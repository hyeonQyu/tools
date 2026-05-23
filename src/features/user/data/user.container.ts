import { usersRepository } from '@/features/user/data/repositories';
import { createUserService } from '@/features/user/data/services';

export const userService = createUserService({ usersRepository });
