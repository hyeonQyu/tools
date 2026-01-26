export class NotFoundError extends Error {
  readonly name = 'NotFoundError';
  constructor(message: string) {
    super(message);
  }
}

export class ConstraintError extends Error {
  readonly name = 'ConstraintError';
  constructor(message: string) {
    super(message);
  }
}

export class QuotaExceededError extends Error {
  readonly name = 'QuotaExceededError';
  constructor(message: string) {
    super(message);
  }
}

export class VersionError extends Error {
  readonly name = 'VersionError';
  constructor(message: string) {
    super(message);
  }
}

export class AbortError extends Error {
  readonly name = 'AbortError';
  constructor(message: string) {
    super(message);
  }
}

export class DataError extends Error {
  readonly name = 'DataError';
  constructor(message: string) {
    super(message);
  }
}

export class InvalidStateError extends Error {
  readonly name = 'InvalidStateError';
  constructor(message: string) {
    super(message);
  }
}

export class TimeoutError extends Error {
  readonly name = 'TimeoutError';
  constructor(message: string) {
    super(message);
  }
}
