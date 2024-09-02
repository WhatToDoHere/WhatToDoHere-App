import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';

import {
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from '../../../../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignInResponse(response);
    }
  }, [response]);

  const handleGoogleSignInResponse = async (response) => {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);

    try {
      await signInWithCredential(auth, credential);
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

      const { identityToken } = credential;
      if (!identityToken) {
        throw new Error('Apple로부터 인증 토큰을 받지 못했습니다.');
      }

      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: identityToken,
      });

      await signInWithCredential(auth, oauthCredential);
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
          source={require('../../../../assets/icons/logo.png')}
          style={styles.logoIcon}
        />
      </View>
      <Text style={styles.title}>WhatToDoHere</Text>
      <Pressable style={styles.googleLogin} onPress={handleGoogleSignIn}>
        <Image
          source={require('../../../../assets/icons/icon-google.png')}
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
    width: 265,
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  appleLogin: {
    width: 265,
    height: 44,
    marginBottom: 10,
    fontSize: 19,
  },
  text: {
    fontFamily: 'Opposit-Medium',
    fontSize: 19,
    color: '#202020',
  },
  whiteText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '500',
    color: '#FFF',
  },
  googleIcon: {
    width: 13,
    height: 13,
    marginRight: 6,
  },
});
