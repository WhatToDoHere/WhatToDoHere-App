import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import MapView, { Marker, Circle } from 'react-native-maps';
import WifiManager from 'react-native-wifi-reborn';

import SearchBar from '../../../components/SearchBar';
import SwitchSelector from '../../../components/SwitchSelector';
import TitleInput from '../../../components/TitleInput';

import { useAtom } from 'jotai';
import { locationAtom } from '../../../atoms';

import { getFullAddress } from '../../../utils/geocoding';

export default function LocationEditor() {
  const { address } = useLocalSearchParams();
  const navigation = useNavigation();
  const [region, setRegion] = useAtom(locationAtom);

  const [alertOption, setAlertOption] = useState('도착할 때');
  const [privacyOption, setPrivacyOption] = useState('공개');
  const [locationTitle, setLocationTitle] = useState('바닐라 코딩');
  const [regionAddress, setRegionAddress] = useState('');
  const [ssid, setSsid] = useState('');

  useEffect(() => {
    if (!region) {
      Alert.alert('오류', '현재 위치를 가져오지 못했습니다.');
    } else {
      (async () => {
        const address = await getFullAddress(region.latitude, region.longitude);
        setRegionAddress(address);
      })();
    }
  }, [region]);

  useEffect(() => {
    const fetchSSID = async () => {
      try {
        const ssid = await WifiManager.getCurrentWifiSSID();
        console.log(ssid);
        setSsid(ssid);
      } catch (error) {
        console.error('Error getting SSID:', error);
      }
    };

    fetchSSID();
  }, []);

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRegion({
      ...region,
      latitude,
      longitude,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '위치 설정',
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log('위치 저장');
              }}
            >
              <Text style={styles.headerRight}>저장</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <TitleInput
          value={locationTitle}
          placeholder={'위치 별칭'}
          onChangeText={setLocationTitle}
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-location.png')}
            style={[styles.sectionIcon, styles.locationIcon]}
          />
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
        <View style={styles.mapContainer}>
          <Pressable
            style={styles.searchBarContainer}
            onPress={() => {
              navigation.navigate('location/searchLocation');
            }}
          >
            <SearchBar
              placeholder="위치 검색"
              onSearch={(text) => console.log('검색:', text)}
              editable={false}
            />
          </Pressable>
          <MapView style={styles.map} initialRegion={region}>
            <Marker
              coordinate={region}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
            <Circle
              center={region}
              radius={300}
              strokeColor="rgba(0,0,255,0.5)"
              fillColor="rgba(0,0,255,0.1)"
            />
          </MapView>
        </View>
        <Text style={styles.address}>📍 {regionAddress}</Text>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-wifi.png')}
            style={[styles.sectionIcon, styles.wifiIcon]}
          />
          <Text style={styles.sectionTitle}>WiFi</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.ssid}>{ssid || 'WiFi 정보 없음'}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-alert.png')}
            style={[styles.sectionIcon, styles.alertIcon]}
          />
          <Text style={styles.sectionTitle}>Alert</Text>
        </View>
        <SwitchSelector
          options={['도착할 때', '떠날 때']}
          selected={alertOption}
          onSelect={(option) => setAlertOption(option)}
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-privacy.png')}
            style={[styles.sectionIcon, styles.privacyIcon]}
          />
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>
        <SwitchSelector
          options={['공개', '비공개']}
          selected={privacyOption}
          onSelect={(option) => setPrivacyOption(option)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#F15858',
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  contents: {
    paddingBottom: 100,
  },
  locationTitle: {
    paddingTop: 10,
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  locationIcon: {
    width: 14,
    height: 16,
  },
  wifiIcon: {
    width: 16,
    height: 12,
  },
  alertIcon: {
    width: 14,
    height: 15,
  },
  privacyIcon: {
    width: 18,
    height: 18,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Opposit-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#303030',
  },
  map: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  searchBarContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 5,
    left: '50%',
    width: '94%',
    marginLeft: '-47%',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  address: {
    marginBottom: 15,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  textBox: {
    justifyContent: 'center',
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  ssid: {
    paddingHorizontal: 20,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#202020',
  },
});
