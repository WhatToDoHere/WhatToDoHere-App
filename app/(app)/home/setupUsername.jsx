import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, loadingAtom } from '../../../atoms';

import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { updateUsername } from '../../../services/firebaseService';
import ValidatedTextInput from '../../../components/ValidatedTextInput';
import { validateUsername } from '../../../utils/validation';

export default function SetupUsername() {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isLoading, setIsLoading] = useAtom(loadingAtom);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const router = useRouter();

  const validateInput = (name) => validateUsername(name, userInfo.username);

  const handleValidationChange = (isValid) => {
    setIsUsernameValid(isValid);
  };

  const handleSetUsername = async () => {
    setIsLoading(true);

    try {
      await updateUsername(userInfo.uid, username, username.toLowerCase());

      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        username,
        lowercaseUsername: username.toLowerCase(),
      }));
      setShouldNavigate(true);
    } catch (error) {
      console.error('Error setting username:', error);
      Alert.alert(
        '오류',
        '사용자 이름 설정에 실패했습니다. 다시 시도해 주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldNavigate && !isLoading) {
      router.replace('/(app)/home');
    }
  }, [shouldNavigate, isLoading, router]);

  const handleCancel = async () => {
    Alert.alert(
      '사용자 이름 설정 취소',
      '사용자 이름 설정을 취소하고 로그아웃 하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut(auth);
              await AsyncStorage.removeItem('user');
              setUserInfo(null);
              setIsLoading(false);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (!isLoading && !userInfo) {
      router.replace('/(auth)/signIn');
    }
  }, [isLoading, userInfo, router]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '사용자 이름 설정',
          headerStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 10,
          },
          headerTitleStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.headerLeft}>취소</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          새 계정에 사용할 사용자 이름을 설정해 주세요. {'\n'}나중에 언제든지
          변경할 수 있습니다.
        </Text>
      </View>
      <ValidatedTextInput
        value={username}
        onChangeText={setUsername}
        placeholder="사용자 이름 입력"
        validateInput={validateInput}
        onValidationChange={handleValidationChange}
        maxLength={10}
      />
      <TouchableOpacity
        style={[
          styles.nextButton,
          (!isUsernameValid || isLoading) && styles.disabledButton,
        ]}
        onPress={handleSetUsername}
        disabled={!isUsernameValid || isLoading}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#202020',
  },
  nextButton: {
    backgroundColor: '#202020',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});
