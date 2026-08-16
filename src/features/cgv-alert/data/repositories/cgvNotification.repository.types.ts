import { CgvNotificationEntity } from '@/features/cgv-alert/types';

export interface CgvNotificationRepository {
  /** 최신순으로 조회한다. 알림은 서버(Cloud Functions)만 생성하므로 쓰기 메서드는 없다. */
  findAll: (limitCount: number) => Promise<CgvNotificationEntity[]>;
}
