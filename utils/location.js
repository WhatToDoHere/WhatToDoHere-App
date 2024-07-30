import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getFullAddress = async (latitude, longitude) => {
  try {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];

      const parts = [
        address.region,
        address.city,
        address.street,
        address.streetNumber,
        address.name,
      ];

      const uniqueParts = [...new Set(parts.filter((part) => part))];

      return removeDuplicateWords(uniqueParts.join(' '));
    }
    return '';
  } catch (error) {
    console.error('Error getting address:', error);
    Alert.alert('오류', '주소를 가져오지 못했습니다.');
    return '';
  }
};

const removeDuplicateWords = (addressString) => {
  const words = addressString.split(' ');

  const uniqueWords = [...new Set(words)];

  const finalAddress = uniqueWords.join(' ');

  return finalAddress;
};

export const isNearCurrentLocation = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance <= 300;
};

export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    Alert.alert('오류', '현재 위치를 가져오지 못했습니다.');

    return null;
  }
};

export const getBackgroundColor = (index) => {
  switch (index % 3) {
    case 0:
      return '#D0E7FD';
    case 1:
      return '#FDFCD8';
    default:
      return '#FFF7F9';
  }
};
