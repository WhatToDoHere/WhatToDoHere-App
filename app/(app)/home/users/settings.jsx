import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { auth } from '../../../../firebaseConfig';
import {
  deleteUser,
  GoogleAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom } from '../../../../atoms';

import { deleteUserData } from '../../../../services/firebaseService';

WebBrowser.maybeCompleteAuthSession();

export default function UserSettings() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);
  const [isDeleting, setIsDeleting] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleReauthResponse(response);
    }
  }, [response]);

  const handleDeleteAccount = async () => {
    Alert.alert(
      '계정 삭제',
      '계정 삭제는 영구적이며 취소할 수 없습니다. \n 위치, 할 일을 포함한 모든 데이터가 제거됩니다.\n 정말로 계정을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: initiateAccountDeletion,
        },
      ],
    );
  };

  const initiateAccountDeletion = async () => {
    setIsDeleting(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('재인증 시작 오류:', error);
      Alert.alert(
        '오류',
        '재인증 과정을 시작할 수 없습니다. 다시 시도해 주세요.',
      );
      setIsDeleting(false);
    }
  };

  const handleReauthResponse = async (response) => {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);

    try {
      const user = auth.currentUser;
      await reauthenticateWithCredential(user, credential);
      await performAccountDeletion();
    } catch (error) {
      console.error('재인증 오류:', error);
      Alert.alert('오류', '재인증에 실패했습니다. 다시 시도해 주세요.');
      setIsDeleting(false);
    }
  };

  const performAccountDeletion = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('사용자가 로그인되어 있지 않습니다.');

      await deleteUserData(user.uid);
      await deleteUser(user);

      await AsyncStorage.removeItem('user');
      setUserInfo(null);
      setLocations([]);

      Alert.alert(
        '계정 삭제 완료',
        '계정과 관련된 모든 데이터가 성공적으로 삭제되었습니다.',
      );
      router.replace('/(auth)/signIn');
    } catch (error) {
      console.error('계정 삭제 오류:', error);
      Alert.alert(
        '오류',
        '계정 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '계정 설정',
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
                source={require('../../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <ScrollView>
        <View style={styles.contents}>
          <View style={styles.listItem}>
            <View style={styles.leftContent}>
              <Image
                source={require('../../../../assets/icons/icon-email.png')}
                style={styles.icon}
              />
              <Text style={styles.label}>이메일</Text>
            </View>
            <Text style={styles.value}>{userInfo?.email}</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.leftContent}>
              <Image
                source={require('../../../../assets/icons/icon-user.png')}
                style={styles.icon}
              />
              <Text style={styles.label}>이름</Text>
            </View>
            <Text style={styles.value}>{userInfo?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>계정 삭제</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#202020" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#F15858',
  },
  backIcon: {
    width: 10,
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contents: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  label: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#202020',
  },
  value: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#909090',
  },
  deleteButton: {
    marginTop: 30,
    backgroundColor: '#202020',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
