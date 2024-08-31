import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom, loadingAtom } from '../atoms';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  saveUserToFirestore,
  getInitialLocations,
} from '../services/firebaseService';
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

  useEffect(() => {
    const checkInitialAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('초기 인증 확인 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const { userData, newLocations } =
            await saveUserToFirestore(firebaseUser);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUserInfo(userData);

          const userLocations =
            newLocations.length > 0
              ? newLocations
              : await getInitialLocations(userData.locations);
          setLocations(userLocations);

          await setupGeofencing(userData.uid).catch((error) => {
            console.error('Geofencing 설정 중 오류 발생:', error);
          });
        } catch (error) {
          console.error('사용자 정보 저장 중 오류 발생:', error);
        }
      } else {
        await AsyncStorage.removeItem('user');
        setUserInfo(null);
        setLocations([]);
      }
      setIsLoading(false);
    });

    checkInitialAuth();

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
