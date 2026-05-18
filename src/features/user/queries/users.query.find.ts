import { userService } from '@/features/user/data';

export const getUsersFindAllQueryOptions = () => ({
  queryKey: ['users', 'find'] as const,
  queryFn: () => userService.getUsers(),
});
