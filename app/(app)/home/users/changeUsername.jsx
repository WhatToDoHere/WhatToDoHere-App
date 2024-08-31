import { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../../atoms';

import ValidatedTextInput from '../../../../components/ValidatedTextInput';
import { updateUsername } from '../../../../services/firebaseService';
import { validateUsername } from '../../../../utils/validation';

export default function ChangeUsername() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [username, setUsername] = useState(userInfo.username);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const navigation = useNavigation();

  const validateInput = (name) => {
    if (name === userInfo.username) return null;
    return validateUsername(name, userInfo.username);
  };

  const handleValidationChange = (isValid) => {
    setIsUsernameValid(isValid);
  };

  const handleUpdateUsername = async () => {
    if (!username || username === userInfo.username) {
      navigation.goBack();

      return;
    }

    try {
      await updateUsername(userInfo.uid, username, username.toLowerCase());
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        username,
        lowercaseUsername: username.toLowerCase(),
      }));

      Alert.alert('성공', '사용자 이름이 성공적으로 변경되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('사용자 이름 변경 오류', error);
      Alert.alert(
        '오류',
        '사용자 이름 변경에 실패했습니다. 다시 시도해 주세요.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '사용자 이름 변경',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require('..../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleUpdateUsername}
              disabled={!isUsernameValid}
            >
              <Text
                style={[
                  styles.headerRight,
                  !isUsernameValid && styles.disabledText,
                ]}
              >
                완료
              </Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>변경할 사용자 이름을 입력해 주세요.</Text>
      </View>
      <ValidatedTextInput
        value={username}
        onChangeText={setUsername}
        validateInput={validateInput}
        onValidationChange={handleValidationChange}
        maxLength={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerLeft: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
  },
  backIcon: {
    width: 10,
    height: 20,
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
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
  disabledText: {
    color: '#A0A0A0',
  },
});
