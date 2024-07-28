import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { selectedLocationAtom } from '../../../../atoms';

import GooglePlacesInput from '../../../../components/GooglePlacesInput';

export default function SearchLocation() {
  const navigation = useNavigation();
  const [, setSelectedLocation] = useAtom(selectedLocationAtom);

  const handlePlaceSelected = (location) => {
    if (location && location.lat && location.lng) {
      setSelectedLocation({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      });

      navigation.goBack();
    } else {
      Alert.alert('오류', '위치 정보를 가져올 수 없습니다. 다시 시도해주세요.');
    }
  };

  const renderContent = () => (
    <View style={styles.contents}>
      <GooglePlacesInput onPlaceSelected={handlePlaceSelected} />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '위치 검색',
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
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.headerLeft}>취소</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={renderContent}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  contents: {
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  currentAddress: {
    marginTop: 20,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  headerLeft: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#F15858',
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
  },
});
