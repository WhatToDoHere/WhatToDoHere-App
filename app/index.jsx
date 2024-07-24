import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

import { useAtom } from 'jotai';
import { userInfoAtom, currentLocationAtom, locationsAtom } from '../atoms';

import SignInScreen from './signIn';

import { saveUserToFirestore } from '../utils/firebaseService';

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    'Opposit-Bold': require('../assets/fonts/Opposit-Bold.ttf'),
    'Opposit-Light': require('../assets/fonts/Opposit-Light.ttf'),
    'Opposit-Medium': require('../assets/fonts/Opposit-Medium.ttf'),
    'Opposit-Regular': require('../assets/fonts/Opposit-Regular.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-Light': require('../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
  });

  const router = useRouter();
  const [, setUserInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);
  const [, setCurrentLocation] = useAtom(currentLocationAtom);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUserInfo(user);

        await saveUserToFirestore(user, setLocations);
        router.replace('/home');
      } else {
        console.log('no user');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '위치 권한이 필요합니다. 기기 설정에서 위치 권한을 활성화해주세요.',
          [{ text: '확인' }],
        );

        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('오류', '현재 위치를 가져오지 못했습니다.');
      }
    })();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return <SignInScreen promptAsync={promptAsync} />;
}
