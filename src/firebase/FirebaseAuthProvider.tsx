import { firebase } from '@/firebase/firebase.config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

function FirebaseAuthProvider({ children }: Props) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        setIsReady(true);
      } else {
        signInAnonymously(firebase.auth).catch((error) => {
          console.error('[FirebaseAuthProvider] 익명 로그인 실패:', error);
        });
      }
    });

    return unsubscribe;
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}

export default FirebaseAuthProvider;
