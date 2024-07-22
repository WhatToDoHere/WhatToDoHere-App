import { Alert } from 'react-native';

export const fetchPlaceDetails = async (placeId) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`,
    );
    const result = await response.json();
    const details = result.result;

    if (!details) {
      Alert.alert(
        '오류',
        '위치 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
      return null;
    }

    return details?.geometry?.location;
  } catch (error) {
    console.error(error);
    Alert.alert(
      '오류',
      '위치 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.',
    );
    return null;
  }
};
