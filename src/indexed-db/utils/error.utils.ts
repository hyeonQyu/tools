import {
  AbortError,
  ConstraintError,
  DataError,
  InvalidStateError,
  NotFoundError,
  QuotaExceededError,
  TimeoutError,
  VersionError,
} from '@/lib';

export const handleIndexedDBError = (error: unknown, context?: string): never => {
  if (error instanceof Error) {
    const errorName = error.name;
    const contextMessage = context ? `[${context}] ` : '';

    switch (errorName) {
      case 'NotFoundError':
        throw new NotFoundError(`${contextMessage}요청한 데이터를 찾을 수 없습니다.`);

      case 'ConstraintError':
        throw new ConstraintError(`${contextMessage}데이터 제약 조건 위반: ${error.message}`);

      case 'QuotaExceededError':
        throw new QuotaExceededError(`${contextMessage}저장 공간이 부족합니다.`);

      case 'VersionError':
        throw new VersionError(`${contextMessage}데이터베이스 버전 오류가 발생했습니다.`);

      case 'AbortError':
        throw new AbortError(`${contextMessage}작업이 중단되었습니다.`);

      case 'DataError':
        throw new DataError(`${contextMessage}잘못된 데이터 형식입니다: ${error.message}`);

      case 'InvalidStateError':
        throw new InvalidStateError(`${contextMessage}데이터베이스가 올바른 상태가 아닙니다.`);

      case 'TimeoutError':
        throw new TimeoutError(`${contextMessage}작업 시간이 초과되었습니다.`);

      default:
        throw new Error(`${contextMessage}데이터베이스 작업 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  throw new Error(`${context ? `[${context}] ` : ''}알 수 없는 오류가 발생했습니다.`);
};

export const safeDBOperation = async <T>(operation: () => Promise<T>, defaultValue: T, context?: string): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`IndexedDB operation failed${context ? ` [${context}]` : ''}:`, error);
    return defaultValue;
  }
};

export const logAndThrow = (error: unknown, context?: string): never => {
  console.error(`IndexedDB Error${context ? ` [${context}]` : ''}:`, error);
  return handleIndexedDBError(error, context);
};
