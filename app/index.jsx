import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.main}>
      <Link style={{ fontSize: 40, marginBottom: 10 }} href="/home">
        Home
      </Link>
      <Link style={{ fontSize: 40 }} href="/login">
        Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
    fontSize: 40,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
});
