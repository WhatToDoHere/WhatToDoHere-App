import { useState, useEffect } from 'react';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom } from '../atoms';

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
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);
  const [isAuthReady, setIsAuthReady] = useState(false);
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
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking initial auth:', error);
      } finally {
        setIsAuthReady(true);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { userData, newLocations } =
            await saveUserToFirestore(firebaseUser);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUserInfo(userData);

          let userLocations;

          if (newLocations.length > 0) {
            userLocations = newLocations;
          } else {
            userLocations = await getInitialLocations(userData.locations);
          }
          setLocations(userLocations);

          await setupGeofencing(userData.uid).catch((error) => {
            console.error('Error in setupGeofencing:', error);
          });
        } catch (error) {
          console.error('Error saving user info:', error);
        }
      } else {
        await AsyncStorage.removeItem('user');
        setUserInfo(null);
        setLocations([]);
      }
      setIsAuthReady(true);
    });

    checkInitialAuth();

    return () => unsubscribe();
  }, []);

  if (!isAuthReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <AuthWrapper user={userInfo}>
      <Slot />
    </AuthWrapper>
  );
}
