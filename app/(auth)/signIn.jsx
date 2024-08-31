import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms';

import {
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';

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

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple 인증 정보:', credential);

      const { identityToken } = credential;
      if (!identityToken) {
        throw new Error('Apple로부터 인증 토큰을 받지 못했습니다.');
      }

      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: identityToken,
      });

      const userCredential = await signInWithCredential(auth, oauthCredential);
      const user = userCredential.user;

      console.log('Firebase 사용자:', user);

      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUserInfo(user);
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        console.log('사용자가 Apple 로그인을 취소했습니다.');
      } else {
        console.error('Apple 로그인 오류:', e);
        console.error('오류 상세:', JSON.stringify(e, null, 2));
      }
    }
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
      <Pressable style={styles.googleLogin} onPress={handleGoogleSignIn}>
        <Image
          source={require('../../assets/icons/icon-google.png')}
          style={styles.googleIcon}
        />
        <Text style={[styles.text, styles.whiteText]}>Google로 로그인</Text>
      </Pressable>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={10}
        style={styles.appleLogin}
        onPress={handleAppleSignIn}
      />
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
  googleLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    height: 50,
    width: 265,
    marginBottom: 10,
  },
  appleLogin: {
    width: 265,
    height: 50,
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
    color: '#FFF',
    fontSize: 19,
    fontFamily: 'System',
    fontWeight: '600',
  },
  googleIcon: {
    width: 13,
    height: 13,
    marginRight: 7,
  },
});
