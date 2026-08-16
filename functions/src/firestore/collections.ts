/** CGV 알림 기능이 사용하는 Firestore 컬렉션 이름. 클라이언트와 반드시 동일해야 한다. */
export const CGV_COLLECTION = {
  watches: 'cgvWatches',
  watchStates: 'cgvWatchStates',
  notifications: 'cgvNotifications',
  pushTokens: 'pushTokens',
  catalogCache: 'cgvCatalogCache',
} as const;
