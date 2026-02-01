# Dialog

MUI Dialog를 명령형(imperative)으로 사용할 수 있게 해주는 유틸리티입니다.

## 개요

React에서 Dialog는 일반적으로 선언적(declarative)으로 사용됩니다. 즉, 상태(state)를 통해 열고 닫는 방식입니다. 하지만 이 유틸리티를 사용하면 `alert()`, `confirm()` 처럼 함수 호출만으로 Dialog를 열고 결과를 Promise로 받을 수 있습니다.

## 설치 및 설정

### 1. DialogProvider 설정

앱의 최상위에 `DialogProvider`로 감싸주세요.

```tsx
import { DialogProvider } from '@/dialog';

function App() {
  return (
    <DialogProvider>
      {/* 나머지 앱 컴포넌트 */}
    </DialogProvider>
  );
}
```

### 2. useDialog 훅 사용

컴포넌트에서 `useDialog` 훅을 사용하여 Dialog를 제어할 수 있습니다.

```tsx
import { useDialog } from '@/dialog';

function MyComponent() {
  const dialog = useDialog();
  
  // ...
}
```

## 사용 방법

### 1. alert() - 알림 다이얼로그

간단한 알림 메시지를 표시합니다. "확인" 버튼만 제공됩니다.

```tsx
const dialog = useDialog();

await dialog.alert({
  title: '알림',
  content: '작업이 완료되었습니다.',
});

console.log('사용자가 확인 버튼을 클릭했습니다.');
```

### 2. confirm() - 확인 다이얼로그

사용자의 확인을 요청합니다. "취소"와 "확인" 버튼을 제공하며, 사용자의 선택에 따라 `true` 또는 `false`를 반환합니다.

```tsx
const dialog = useDialog();

const result = await dialog.confirm({
  title: '삭제 확인',
  content: '정말로 삭제하시겠습니까?',
});

if (result) {
  console.log('사용자가 확인을 선택했습니다.');
  // 삭제 로직 실행
} else {
  console.log('사용자가 취소를 선택했습니다.');
}
```

### 3. open() - 커스텀 다이얼로그

완전히 커스터마이징 가능한 Dialog를 열 수 있습니다. `content`에 함수를 전달하면 `close` 함수를 받아 원하는 UI를 구성할 수 있습니다.

```tsx
const dialog = useDialog();

const result = await dialog.open<string>({
  title: '이름 입력',
  content: (close) => {
    const [name, setName] = useState('');
    
    return (
      <>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close()}>취소</Button>
          <Button 
            onClick={() => close(name)} 
            variant="contained"
            disabled={!name}
          >
            확인
          </Button>
        </DialogActions>
      </>
    );
  },
  maxWidth: 'sm',
  fullWidth: true,
});

if (result) {
  console.log('입력된 이름:', result);
} else {
  console.log('취소되었습니다.');
}
```

## API Reference

### DialogOptions<T>

Dialog의 옵션을 정의하는 타입입니다.

```typescript
type DialogOptions<T = unknown> = {
  // MUI Dialog props
  fullScreen?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  scroll?: 'body' | 'paper';
  transitionDuration?: number | { appear?: number; enter?: number; exit?: number };
  keepMounted?: boolean;
  slots?: DialogProps['slots'];
  
  // 커스텀 옵션
  title?: ReactNode;
  content: Resolvable<(close: (result?: T) => void) => ReactNode>;
  disableBackdropClick?: boolean;  // 배경 클릭으로 닫기 비활성화
  disableEscapeKeyDown?: boolean;  // ESC 키로 닫기 비활성화
}
```

### useDialog()

Dialog를 제어하기 위한 훅입니다.

```typescript
interface DialogContextValue {
  // 커스텀 Dialog 열기
  open: <T = unknown>(options: DialogOptions<T>) => Promise<T | null>;
  
  // 알림 Dialog 열기
  alert: (options: Omit<DialogOptions<void>, 'content'> & { 
    content: ReactNode 
  }) => Promise<void>;
  
  // 확인 Dialog 열기
  confirm: (options: Omit<DialogOptions<boolean>, 'content'> & { 
    content: ReactNode 
  }) => Promise<boolean>;
}
```

## 고급 기능

### 다중 Dialog

여러 개의 Dialog를 동시에 열 수 있습니다. 각 Dialog는 독립적으로 관리됩니다.

```tsx
const dialog = useDialog();

// 첫 번째 Dialog
const promise1 = dialog.alert({
  title: '첫 번째',
  content: '첫 번째 메시지',
});

// 두 번째 Dialog (첫 번째가 닫히기 전에 열림)
const promise2 = dialog.confirm({
  title: '두 번째',
  content: '두 번째 메시지',
});

await Promise.all([promise1, promise2]);
```

### 닫기 방지

배경 클릭이나 ESC 키로 Dialog가 닫히는 것을 방지할 수 있습니다.

```tsx
await dialog.confirm({
  title: '중요한 선택',
  content: '반드시 선택해야 합니다.',
  disableBackdropClick: true,
  disableEscapeKeyDown: true,
});
```

### 타입 안전성

제네릭을 사용하여 Dialog에서 반환되는 값의 타입을 지정할 수 있습니다.

```tsx
interface UserInfo {
  name: string;
  age: number;
}

const userInfo = await dialog.open<UserInfo>({
  title: '사용자 정보',
  content: (close) => {
    // ... UI 구성
    return (
      <Button onClick={() => close({ name: 'John', age: 30 })}>
        제출
      </Button>
    );
  },
});

if (userInfo) {
  console.log(userInfo.name); // 타입 안전!
  console.log(userInfo.age);  // 타입 안전!
}
```

## 작동 원리

1. **Context API**: `DialogContext`를 통해 앱 전역에서 Dialog를 제어할 수 있습니다.

2. **Promise 기반**: 각 Dialog 호출은 Promise를 반환하며, 사용자가 Dialog를 닫으면 resolve됩니다.

3. **상태 관리**: `DialogProvider`가 열린 모든 Dialog의 상태를 관리합니다.

4. **Resolvable 패턴**: `content`는 값(ReactNode) 또는 함수를 받을 수 있어, 동적인 컨텐츠를 구성할 수 있습니다.

5. **Transition 처리**: Dialog가 닫히는 애니메이션이 완료된 후 DOM에서 제거됩니다.

## 예제

### 비동기 작업 확인

```tsx
async function deleteItem(id: string) {
  const confirmed = await dialog.confirm({
    title: '삭제 확인',
    content: '이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
  });
  
  if (!confirmed) return;
  
  try {
    await api.delete(`/items/${id}`);
    await dialog.alert({
      title: '성공',
      content: '삭제되었습니다.',
    });
  } catch (error) {
    await dialog.alert({
      title: '오류',
      content: '삭제에 실패했습니다.',
    });
  }
}
```

### 폼 입력 받기

```tsx
async function editUser(userId: string) {
  const result = await dialog.open<{ name: string; email: string }>({
    title: '사용자 정보 수정',
    content: (close) => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      
      return (
        <>
          <DialogContent>
            <TextField
              fullWidth
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => close()}>취소</Button>
            <Button 
              onClick={() => close({ name, email })} 
              variant="contained"
              disabled={!name || !email}
            >
              저장
            </Button>
          </DialogActions>
        </>
      );
    },
    maxWidth: 'sm',
    fullWidth: true,
  });
  
  if (result) {
    await api.updateUser(userId, result);
  }
}
```

## 주의사항

- `DialogProvider`는 앱의 최상위에 한 번만 설정해야 합니다.
- `useDialog` 훅은 `DialogProvider` 내부에서만 사용할 수 있습니다.
- Dialog를 닫을 때 `close()` 함수에 값을 전달하지 않으면 `null`이 반환됩니다.
- `alert()`는 항상 `void`를 반환하고, `confirm()`은 취소 시 `false`를 반환합니다.
