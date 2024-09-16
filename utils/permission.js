import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';

const openSettings = () => {
  Linking.openSettings();
};

export const requestForegroundLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      '위치 권한 필요',
      '앱 사용을 위해 위치 권한이 필요합니다. 설정에서 권한을 항상 허용해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: openSettings },
      ],
    );
    return false;
  }
  return true;
};

export const requestBackgroundLocationPermission = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      '백그라운드 위치 권한 필요',
      '위치 기반 알림을 위해 백그라운드 위치 권한이 필요합니다. 설정에서 권한을 항상 허용해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: openSettings },
      ],
    );
    return false;
  }
  return true;
};

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      '알림 권한 필요',
      '할 일 알림을 받기 위해 알림 권한을 허용해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: openSettings },
      ],
    );
    return false;
  }
  return true;
};
