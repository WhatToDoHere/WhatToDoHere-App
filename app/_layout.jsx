import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAtom } from 'jotai';
import {
  isGuestAtom,
  userInfoAtom,
  locationsAtom,
  loadingAtom,
} from '../atoms';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getInitialLocations } from '../services/firebaseService';
import { saveGuestUser } from '../services/asyncStorageService';
import { migrateAsyncToFirestore } from '../services/migrationService';
import { setupGeofencing } from '../services/notificationService';
import AuthWrapper from '../components/AuthWrapper';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [, setIsGuest] = useAtom(isGuestAtom);
  const [, setUserInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);
  const [isLoading, setIsLoading] = useAtom(loadingAtom);
  const [fontsLoaded, fontError] = useFonts({
    'Opposit-Bold': require('../assets/fonts/Opposit-Bold.ttf'),
    'Opposit-Light': require('../assets/fonts/Opposit-Light.ttf'),
    'Opposit-Medium': require('../assets/fonts/Opposit-Medium.ttf'),
    'Opposit-Regular': require('../assets/fonts/Opposit-Regular.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-Light': require('../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
  });

  const initializeGuestUser = async () => {
    const { userData, locations } = await saveGuestUser();
    setUserInfo(userData);
    setLocations(Object.values(locations));
    setIsGuest(true);
  };

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const guestUser = await AsyncStorage.getItem('guest');

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserInfo(userData);

          const userLocations = await getInitialLocations(userData.locations);
          setLocations(userLocations);
          await setupGeofencing(userData.uid);
        } else if (guestUser) {
          const guestData = JSON.parse(guestUser);
          setUserInfo(guestData);

          const guestLocations = await AsyncStorage.getItem('guestLocations');
          setLocations(JSON.parse(guestLocations));
          setIsGuest(true);
        } else {
          await initializeGuestUser();
        }
      } catch (error) {
        console.error('사용자 초기화 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      try {
        if (firebaseUser) {
          const { userData, locations } =
            await migrateAsyncToFirestore(firebaseUser);
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          setUserInfo(userData);
          setLocations(locations);

          await setupGeofencing(userData.uid);
          setIsGuest(false);
        } else {
          await AsyncStorage.removeItem('user');
          await initializeGuestUser();
        }
      } catch (error) {
        console.error('사용자 상태 변경 처리 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    });

    initializeUser();

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthWrapper>
      <Slot />
    </AuthWrapper>
  );
}
