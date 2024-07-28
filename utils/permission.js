import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export const requestForegroundLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      '위치 권한 필요',
      '앱 사용을 위해 위치 권한이 필요합니다. 설정에서 권한을 항상 허용해주세요.',
      [{ text: '확인' }],
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
      '더 나은 경험을 위해 백그라운드 위치 권한이 필요합니다. 설정에서 권한을 항상 허용해주세요.',
      [{ text: '확인' }],
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
      '중요한 알림을 받기 위해 알림 권한을 허용해주세요.',
    );
    return false;
  }
  return true;
};

export const requestAllPermissions = async () => {
  const foregroundLocation = await requestForegroundLocationPermission();
  const backgroundLocation = await requestBackgroundLocationPermission();
  const notification = await requestNotificationPermission();

  return {
    foregroundLocation,
    backgroundLocation,
    notification,
  };
};
