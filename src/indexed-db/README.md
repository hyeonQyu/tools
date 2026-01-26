# IndexedDB 모듈 사용 가이드

## 개요

이 모듈은 `idb` 라이브러리와 `zod`를 기반으로 한 **타입 안전**하고 **런타임 검증** 기능이 포함된 IndexedDB API를 제공합니다.
**React Context Provider 패턴**을 따르며, **Zod 스키마**를 통해 타입 추론과 검증을 한 곳에서 관리합니다.

## 디렉토리 구조

```
src/indexed-db/
├── index.ts                    # 메인 exports (test 폴더 제외)
├── IndexedDBContext.ts        # Context 정의
├── IndexedDBProvider.tsx      # Provider 컴포넌트
├── db.config.ts               # DB 설정 (Zod 스키마 포함)
├── hooks/
│   ├── index.ts
│   ├── useIndexedDB.ts        # 내부용 hook
│   └── useIndexedDBStore.ts   # Store 생성 hook
├── types/
│   ├── db.types.ts            # DB 타입 정의
│   └── store.types.ts         # Store 타입 정의
├── utils/
│   ├── store.utils.ts         # Store 생성 함수
│   ├── db.utils.ts            # DB 관리 유틸리티
│   └── error.utils.ts         # 에러 핸들링
└── test/                      # 테스트 (별도 import)
    ├── test.utils.ts
    └── test.scenarios.ts
```

## 핵심 개념

### 1. Provider 패턴

`IndexedDBProvider`가 DB 초기화를 담당하고, Context를 통해 하위 컴포넌트에 제공합니다:

```typescript
import IndexedDBProvider from '@/indexed-db/IndexedDBProvider';

export default function RootLayout({ children }) {
  return (
    <IndexedDBProvider>
      {children}
    </IndexedDBProvider>
  );
}
```

### 2. Zod 기반 스키마 정의

Zod 스키마로 타입 정의와 검증을 동시에 관리합니다:

```typescript
import { z } from 'zod';
import { createDBConfig } from '@/indexed-db';

// 1. Zod 스키마 정의
const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

// 2. DB 설정에 스키마 포함
const dbConfig = createDBConfig({
  name: 'MyAppDB',
  version: 1,
  stores: [
    {
      name: 'users',
      schema: userSchema, // 타입 + 검증
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'email', keyPath: 'email', options: { unique: true } },
        { name: 'age', keyPath: 'age', options: { unique: false } },
      ],
    },
  ] as const, // const assertion 필수!
});
```

### 3. useIndexedDBStore Hook

`storeName`만으로 타입이 자동 추론됩니다:

```typescript
'use client';

import { useIndexedDBStore } from '@/indexed-db';

export function MyComponent() {
  const userStore = useIndexedDBStore('default'); // 타입 자동 추론!

  // null 체크로 로딩 상태 처리
  if (!userStore) {
    return <div>Loading...</div>;
  }

  const handleAdd = async () => {
    await userStore.add({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    }); // ✅ 자동 검증됨
  };

  return <button onClick={handleAdd}>Add User</button>;
}
```

## 기본 사용법

### 1. Provider 설정

루트 layout에 IndexedDBProvider를 추가합니다 (이미 설정됨):

```typescript
import IndexedDBProvider from '@/indexed-db/IndexedDBProvider';

export default function RootLayout({ children }) {
  return (
    <IndexedDBProvider>
      {children}
    </IndexedDBProvider>
  );
}
```

### 2. 기본 설정으로 사용

```typescript
'use client';

import { useIndexedDBStore } from '@/indexed-db';

export function MyComponent() {
  // 기본 'default' store 사용
  const store = useIndexedDBStore('default');

  if (!store) {
    return <div>Loading IndexedDB...</div>;
  }

  const handleAdd = async () => {
    await store.add({
      timestamp: Date.now(),
    });
  };

  return <button onClick={handleAdd}>Add Data</button>;
}
```

### 3. 커스텀 DB 설정

```typescript
import { z } from 'zod';
import { createDBConfig } from '@/indexed-db';
import IndexedDBProvider from '@/indexed-db/IndexedDBProvider';

// 1. 스키마 정의
const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0),
});

const postSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  title: z.string().min(1).max(200),
  content: z.string(),
  createdAt: z.number(),
});

// 2. DB 설정
const myDBConfig = createDBConfig({
  name: 'MyApp',
  version: 1,
  stores: [
    {
      name: 'users',
      schema: userSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [{ name: 'email', keyPath: 'email', options: { unique: true } }],
    },
    {
      name: 'posts',
      schema: postSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [{ name: 'userId', keyPath: 'userId', options: { unique: false } }],
    },
  ] as const,
});

// 3. Provider에 설정 전달
export default function RootLayout({ children }) {
  return (
    <IndexedDBProvider config={myDBConfig}>
      {children}
    </IndexedDBProvider>
  );
}

// 4. 컴포넌트에서 사용
function UserList() {
  const userStore = useIndexedDBStore('users'); // User 타입 자동!
  const postStore = useIndexedDBStore('posts'); // Post 타입 자동!

  if (!userStore || !postStore) {
    return <div>Loading...</div>;
  }

  // 타입 안전하게 사용
  // ...
}
```

## Store API

### 기본 CRUD

```typescript
'use client';

import { useIndexedDBStore } from '@/indexed-db';

function MyComponent() {
  const store = useIndexedDBStore('users');

  if (!store) {
    return <div>Loading...</div>;
  }

  // 추가 (자동 검증)
  const handleAdd = async () => {
    const id = await store.add({
      name: 'John',
      email: 'john@example.com',
      age: 30,
    });
  };

  // 조회
  const handleGet = async (id) => {
    const user = await store.get(id);
  };

  // 전체 조회
  const handleGetAll = async () => {
    const allUsers = await store.getAll();
  };

  // 수정 (자동 검증)
  const handleUpdate = async (id) => {
    await store.update(id, {
      name: 'John Updated',
      email: 'john@example.com',
      age: 31,
    });
  };

  // 삭제
  const handleDelete = async (id) => {
    await store.delete(id);
  };

  // ...
}
```

// 삭제
await store.delete(id);

// 전체 삭제
await store.clear();

// 개수
const count = await store.count();

// 존재 여부
const exists = await store.exists(id);

````

### 인덱스 검색

```typescript
// 인덱스로 단일 검색
const user = await store.findByIndex('email', 'john@example.com');

// 인덱스로 다중 검색
const users = await store.getAllByIndex('age', 30);

// 옵션 사용
const users = await store.getAllByIndex('age', 30, { limit: 10 });
````

### 대량 작업

```typescript
// 대량 추가 (각 항목 자동 검증)
const users = [
  { name: 'User 1', email: 'user1@example.com', age: 25 },
  { name: 'User 2', email: 'user2@example.com', age: 28 },
];
const ids = await store.bulkAdd(users);

// 대량 수정 (각 항목 자동 검증)
await store.bulkUpdate([
  { id: 1, data: { name: 'Updated 1', email: 'user1@example.com', age: 26 } },
  { id: 2, data: { name: 'Updated 2', email: 'user2@example.com', age: 29 } },
]);

// 대량 삭제
await store.bulkDelete([1, 2, 3]);
```

### 페이지네이션

```typescript
// 기본 페이지네이션
const result = await store.getPaginated({
  offset: 0,
  limit: 10,
});

console.log(result.data); // 10개 항목
console.log(result.total); // 전체 개수
console.log(result.hasMore); // 더 있는지 여부

// 인덱스 기반 페이지네이션
const result = await store.getPaginatedByIndex('age', 30, {
  offset: 0,
  limit: 10,
});
```

### 고급 조회

```typescript
// 조건 필터링
const adults = await store.filter((user) => user.age >= 18);

// 첫 번째 매칭 항목
const firstAdult = await store.find((user) => user.age >= 18);

// 범위 쿼리
const users = await store.getRange(20, 30); // age 20~30

// 순회
await store.forEach((user, key) => {
  console.log(`User ${key}:`, user);
});
```

## Zod 검증

### 자동 검증

모든 `add`, `update`, `bulkAdd`, `bulkUpdate` 작업은 자동으로 Zod 검증을 수행합니다:

```typescript
try {
  await store.add({
    name: 'John',
    email: 'invalid-email', // ❌ 이메일 형식 오류
    age: 30,
  });
} catch (error) {
  console.error(error.message); // "Validation failed: ..."
}
```

### 검증 규칙 예시

```typescript
const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.number().default(() => Date.now()),
});
```

## DB 관리 함수

```typescript
import { deleteIndexedDB, listIndexedDBs } from '@/indexed-db';

// DB 삭제
await deleteIndexedDB('MyAppDB');

// 사용 가능한 모든 DB 목록
const databases = await listIndexedDBs();
```

## 마이그레이션

버전 업그레이드 시 커스텀 마이그레이션 로직을 제공할 수 있습니다:

```typescript
const db = await initDB(dbConfig, (db, oldVersion, newVersion) => {
  if (oldVersion < 2) {
    // 버전 2로 업그레이드 시 실행할 로직
    const tx = db.transaction.objectStore('users');
    // ...
  }
});
```

## 테스트

테스트 코드는 별도로 import해서 사용합니다:

```typescript
import { runAllTests, runPerformanceBenchmark } from '@/indexed-db/test';

// 모든 테스트 실행
const results = await runAllTests();
console.log(`Total: ${results.totalTests}, Success: ${results.totalSuccess}`);

// 성능 벤치마크
const benchmark = await runPerformanceBenchmark();
```

### Playground UI

브라우저에서 `/playground/indexed-db`로 접근하여 UI에서 테스트할 수 있습니다.

## 에러 핸들링

모든 에러는 프로젝트의 표준 에러 시스템과 통합되어 있습니다:

```typescript
import { NotFoundError } from '@/errors';

try {
  const user = await store.get(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('User not found');
  }
}
```

## 완전한 예제

```typescript
import { z } from 'zod';
import { createDBConfig, initDB, createIndexedDBStore } from '@/indexed-db';

// 1. 스키마 정의
const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18).max(150),
  role: z.enum(['admin', 'user']),
  createdAt: z.number().default(() => Date.now()),
});

// 2. DB 설정
const dbConfig = createDBConfig({
  name: 'MyApp',
  version: 1,
  stores: [
    {
      name: 'users',
      schema: userSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'email', keyPath: 'email', options: { unique: true } },
        { name: 'role', keyPath: 'role', options: { unique: false } },
      ],
    },
  ] as const,
});

// 3. 초기화
await initDB(dbConfig);

// 4. Store 생성 - 타입 자동 추론!
const userStore = createIndexedDBStore('users');

// 5. 사용
try {
  // 추가 (자동 검증)
  const id = await userStore.add({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    role: 'admin',
  });

  // 조회
  const user = await userStore.get(id);
  console.log(user);

  // 인덱스 검색
  const admins = await userStore.getAllByIndex('role', 'admin');
  console.log('Admins:', admins);

  // 페이지네이션
  const page = await userStore.getPaginated({ offset: 0, limit: 10 });
  console.log('Page 1:', page.data);
} catch (error) {
  if ((error as Error).message.includes('Validation failed')) {
    console.error('Data validation failed:', error);
  } else {
    console.error('Database error:', error);
  }
}
```

## 장점

1. ✅ **완전한 타입 안전성** - `storeName`만으로 타입 자동 추론
2. ✅ **런타임 검증** - Zod가 잘못된 데이터 자동 차단
3. ✅ **간단한 API** - `createIndexedDBStore('users')` 끝
4. ✅ **중앙 관리** - 스키마 한 곳에서 타입 + 검증 관리
5. ✅ **자동완성** - `storeName` 입력 시 자동완성
6. ✅ **DX 최상** - 제네릭 타입 파라미터 불필요
7. ✅ **유지보수 쉬움** - 스키마만 수정하면 타입도 자동 변경
8. ✅ **싱글톤 DB** - `db` 인스턴스를 매번 전달하지 않아도 됨

## 주의사항

1. **브라우저 환경에서만 동작**: IndexedDB는 브라우저 API입니다.
2. **비동기 작업**: 모든 메서드는 Promise를 반환합니다.
3. **동일 출처 정책**: 같은 origin에서만 접근 가능합니다.
4. **용량 제한**: 브라우저마다 저장 용량 제한이 있습니다.
5. **test 폴더**: `@/indexed-db`에서 export되지 않으므로 별도로 import해야 합니다.
6. **const assertion**: `stores` 배열은 반드시 `as const`로 정의해야 타입 추론이 작동합니다.
7. **Provider 필수**: `useIndexedDBStore`를 사용하기 전에 `IndexedDBProvider`로 감싸야 합니다.
8. **Zod 검증**: 검증 실패 시 에러가 발생하므로 try-catch로 처리해야 합니다.
9. **로딩 상태**: store가 `null`인 경우 DB가 아직 초기화되지 않은 상태입니다.

## 예제 코드

더 많은 예제는 `src/indexed-db/test/test.scenarios.ts`를 참고하세요.
