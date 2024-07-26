import { useState, useEffect, useRef } from 'react';
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

import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import WifiManager from 'react-native-wifi-reborn';

import SearchBar from '../../../components/SearchBar';
import SwitchSelector from '../../../components/SwitchSelector';
import TitleInput from '../../../components/TitleInput';

import { useAtom } from 'jotai';
import {
  currentLocationAtom,
  selectedLocationAtom,
  userInfoAtom,
  locationsAtom,
} from '../../../atoms';

import { getFullAddress } from '../../../utils/location';
import {
  getUserLocationCount,
  addLocation,
  updateLocation,
} from '../../../utils/firebaseService';

export default function LocationForm() {
  const navigation = useNavigation();
  const { mode, location } = useLocalSearchParams();

  const [currentLocation] = useAtom(currentLocationAtom);
  const [selectedLocation, setSelectedLocation] = useAtom(selectedLocationAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);

  const [region, setRegion] = useState(null);
  const [privacyOption, setPrivacyOption] = useState('비공개');
  const [locationTitle, setLocationTitle] = useState('');
  const [regionAddress, setRegionAddress] = useState('');
  const [ssid, setSsid] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      if (mode === 'edit' && location) {
        const parsedLocation = JSON.parse(location);

        setLocationTitle(parsedLocation.alias);
        const newRegion = {
          latitude: parsedLocation.latitude || currentLocation.latitude,
          longitude: parsedLocation.longitude || currentLocation.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        };
        setRegion(newRegion);
        setAlertOption(
          parsedLocation.alertType === 'departure' ? '떠날 때' : '도착할 때',
        );
        setPrivacyOption(
          parsedLocation.privacy === 'public' ? '공개' : '비공개',
        );
        setSsid(
          parsedLocation.ssid ||
            (!parsedLocation.latitude && !parsedLocation.longitude
              ? await WifiManager.getCurrentWifiSSID()
              : 'WiFi 정보 없음'),
        );
      } else {
        const locationCount = await getUserLocationCount(userInfo.uid);

        setLocationTitle(`Location ${locationCount + 1}`);

        const newRegion = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        };

        setRegion(newRegion);
        setSsid(await WifiManager.getCurrentWifiSSID());
      }
    };

    initialize();

    return () => {
      setSelectedLocation(null);
    };
  }, [mode, location, currentLocation, userInfo.uid]);

  useEffect(() => {
    navigation.setOptions({
      title: mode === 'add' ? '위치 추가' : '위치 설정',
    });
  }, [mode]);

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const newRegion = { ...selectedLocation };
      setRegion(newRegion);

      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (region && region.latitude && region.longitude) {
      (async () => {
        try {
          const address = await getFullAddress(
            region.latitude,
            region.longitude,
          );
          setRegionAddress(address);
        } catch (error) {
          console.error('Error getting address:', error);
        }
      })();
    }
  }, [region]);

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    };

    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 1000);
  };

  const handleSave = async () => {
    const locationData = {
      alias: locationTitle,
      latitude: region.latitude,
      longitude: region.longitude,
      address: regionAddress,
      ssid,
      privacy: privacyOption === '공개' ? 'public' : 'private',
      userId: userInfo.uid,
    };

    if (mode === 'add') {
      await addLocation(userInfo.uid, locationData, setLocations);
    } else if (mode === 'edit') {
      const parsedLocation = JSON.parse(location);
      await updateLocation(parsedLocation.id, locationData, setLocations);
    }

    Alert.alert('완료', '위치가 저장되었습니다.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
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
            <TouchableOpacity onPress={handleSave}>
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
            <SearchBar placeholder="위치 검색" editable={false} />
          </Pressable>
          {region && (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              region={region}
              provider={PROVIDER_GOOGLE}
            >
              <Circle
                center={region}
                radius={300}
                strokeWidth={2}
                strokeColor="rgba(47, 147, 240, 0.8)"
                fillColor="rgba(47, 147, 240, 0.3)"
              />
              <Marker
                coordinate={region}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            </MapView>
          )}
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
            source={require('../../../assets/icons/icon-privacy.png')}
            style={[styles.sectionIcon, styles.privacyIcon]}
          />
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>
        <SwitchSelector
          options={['비공개', '공개']}
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
    height: 350,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
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
    shadowColor: '#202020',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  address: {
    marginBottom: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#202020',
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
