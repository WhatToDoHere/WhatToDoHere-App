import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.title}>WhatToDoHere</Text>
      <Pressable
        style={[styles.button, styles.googleLogin]}
        onPress={handleLogin}
      >
        <Image
          source={require('../../assets/icons/icon-google.png')}
          style={styles.googleIcon}
        />
        <Text style={[styles.text, styles.whiteText]}>Sign in with Google</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.gusetLogin]}
        onPress={handleLogin}
      >
        <Text style={styles.text}>Guest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 50,
    fontFamily: 'Opposit-Bold',
    fontSize: 44,
  },
  button: {
    minWidth: 265,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
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
    fontSize: 20,
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
