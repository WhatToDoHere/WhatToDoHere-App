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
