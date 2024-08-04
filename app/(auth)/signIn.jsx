import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const [, setUserInfo] = useAtom(userInfoAtom);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleSignInResponse(response);
    }
  }, [response]);

  const handleSignInResponse = async (response) => {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);

    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      await AsyncStorage.setItem('user', JSON.stringify(user));

      setUserInfo(user);
    } catch (error) {
      console.error('로그인 오류', error);
    }
  };

  const handleSignIn = () => {
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icons/logo.png')}
          style={styles.logoIcon}
        />
      </View>
      <Text style={styles.title}>WhatToDoHere</Text>
      <Pressable
        style={[styles.button, styles.googleLogin]}
        onPress={handleSignIn}
      >
        <Image
          source={require('../../assets/icons/icon-google.png')}
          style={styles.googleIcon}
        />
        <Text style={[styles.text, styles.whiteText]}>Sign in with Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logoContainer: {
    marginTop: -50,
    marginBottom: 30,
    textAlign: 'center',
  },
  logoIcon: {
    width: 120,
    height: 120,
  },
  title: {
    marginBottom: 50,
    fontFamily: 'Opposit-Bold',
    fontSize: 42,
    color: '#202020',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 265,
    minHeight: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 3,
    fontFamily: 'Opposit-Bold',
  },
  googleLogin: {
    backgroundColor: '#202020',
  },
  gusetLogin: {
    backgroundColor: '#EEEEEE',
  },
  text: {
    fontFamily: 'Opposit-Medium',
    fontSize: 19,
    color: '#202020',
  },
  whiteText: {
    color: 'white',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginTop: -5,
    marginRight: 20,
  },
});
