import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function AuthWrapper({ user, children }) {
  const [initialRender, setInitialRender] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);

      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (user && !inAppGroup) {
      console.log('Redirecting to home');
      router.replace('/(app)/home');
    } else if (!user && !inAuthGroup) {
      console.log('Redirecting to sign in');
      router.replace('/(auth)/signIn');
    }
  }, [user, segments, initialRender]);

  return <>{children}</>;
}
