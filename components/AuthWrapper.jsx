import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, loadingAtom } from '../atoms';

export default function AuthWrapper({ children }) {
  const [userInfo] = useAtom(userInfoAtom);
  const [isLoading] = useAtom(loadingAtom);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    const inSetupUsername = segments[1] === 'setupUsername';

    if (userInfo && !userInfo.username && !inSetupUsername) {
      console.log('Redirecting to setup username');
      router.replace('/(app)/home/setupUsername');
    } else if (userInfo && userInfo.username && !inAppGroup) {
      console.log('Redirecting to home');
      router.replace('/(app)/home');
    } else if (!userInfo && !inAuthGroup) {
      console.log('Redirecting to sign in');
      router.replace('/(auth)/signIn');
    }
  }, [userInfo, isLoading, segments, router]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
