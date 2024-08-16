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
  ActivityIndicator,
  Switch,
  LayoutAnimation,
} from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo';

import { useAtom } from 'jotai';
import {
  currentLocationAtom,
  selectedLocationAtom,
  userInfoAtom,
  locationsAtom,
} from '../../../../atoms';

import SearchBar from '../../../../components/SearchBar';
import SwitchSelector from '../../../../components/SwitchSelector';
import TitleInput from '../../../../components/TitleInput';
import DeleteButton from '../../../../components/DeleteButton';

import {
  getFullAddress,
  isNearCurrentLocation,
} from '../../../../utils/location';
import {
  getUserLocationCount,
  addLocation,
  updateLocation,
  deleteLocation,
} from '../../../../services/firebaseService';

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
  const [isWifiEnabled, setIsWifiEnabled] = useState(false);
  const [ssid, setSsid] = useState(null);
  const [bssid, setBssid] = useState(null);
  const [isLoadingWifi, setIsLoadingWifi] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isWifiEnabled]);

  const fetchWifiInfo = async () => {
    if (!isWifiEnabled) return;

    setIsLoadingWifi(true);
    try {
      if (
        isNearCurrentLocation(
          region.latitude,
          region.longitude,
          currentLocation.latitude,
          currentLocation.longitude,
        )
      ) {
        await NetInfo.configure({
          shouldFetchWiFiSSID: true,
        });

        const netInfo = await NetInfo.fetch();

        if (netInfo.type === 'wifi' && netInfo.details) {
          setSsid(netInfo.details.ssid || null);
          setBssid(netInfo.details.bssid || null);
        } else {
          setSsid(null);
          setBssid(null);
        }
      } else {
        setSsid(null);
        setBssid(null);
      }
    } catch (error) {
      console.error('Error fetching WiFi info:', error);
      setSsid(null);
      setBssid(null);
    } finally {
      setIsLoadingWifi(false);
    }
  };

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
        setPrivacyOption(
          parsedLocation.privacy === 'public' ? '공개' : '비공개',
        );
        setIsWifiEnabled(parsedLocation.isWifiEnabled || false);

        if (parsedLocation.isWifiEnabled) {
          if (parsedLocation.ssid && parsedLocation.bssid) {
            setSsid(parsedLocation.ssid);
            setBssid(parsedLocation.bssid);
          } else if (
            isNearCurrentLocation(
              newRegion.latitude,
              newRegion.longitude,
              currentLocation.latitude,
              currentLocation.longitude,
            )
          ) {
            const netInfo = await NetInfo.fetch();
            if (netInfo.type === 'wifi' && netInfo.details) {
              setSsid(netInfo.details.ssid || null);
              setBssid(netInfo.details.bssid || null);
            } else {
              setSsid(null);
              setBssid(null);
            }
          } else {
            setSsid(null);
            setBssid(null);
          }
        } else {
          setSsid(null);
          setBssid(null);
        }
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

        setIsWifiEnabled(false);
        setSsid(null);
        setBssid(null);
      }
    };

    initialize();

    return () => {
      setSelectedLocation(null);
    };
  }, [mode, location, currentLocation, userInfo.uid]);

  useEffect(() => {
    if (region) {
      fetchWifiInfo();
    }
  }, [region]);

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

  useEffect(() => {
    if (isWifiEnabled && region) {
      fetchWifiInfo();
    } else {
      setSsid(null);
      setBssid(null);
    }
  }, [isWifiEnabled, region]);

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
      isWifiEnabled: isWifiEnabled,
      privacy: privacyOption === '공개' ? 'public' : 'private',
      userId: userInfo.uid,
    };

    if (isWifiEnabled) {
      locationData.ssid = ssid;
      locationData.bssid = bssid;
    }

    if (mode === 'add') {
      await addLocation(userInfo.uid, locationData, setLocations);
    } else if (mode === 'edit') {
      const parsedLocation = JSON.parse(location);
      await updateLocation(parsedLocation.id, locationData, setLocations);
    }

    Alert.alert('완료', '위치가 저장되었습니다.');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      '삭제',
      '위치를 삭제하면 위치에 지정된 할 일들도 모두 삭제됩니다.\n이 위치를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await deleteLocation(
                userInfo.uid,
                JSON.parse(location).id,
                setLocations,
              );
              Alert.alert('성공', '위치가 삭제되었습니다.');
              navigation.goBack();
            } catch (error) {
              console.error('위치 삭제 중 오류 발생:', error);
              Alert.alert('오류', '위치를 삭제하는 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: false },
    );
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
        <View style={[styles.titleContainer, styles.firstTitle]}>
          <Image
            source={require('../../../../assets/icons/icon-location.png')}
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
                strokeColor="#b2d8fc"
                fillColor="rgba(181, 219, 255, 0.5)"
              />
              <Marker
                coordinate={region}
                draggable
                onDragEnd={handleMarkerDragEnd}
              >
                <Image
                  source={require('../../../../assets/icons/icon-map-pin.png')}
                  style={styles.mapMarker}
                />
              </Marker>
            </MapView>
          )}
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>📍 {regionAddress}</Text>
        </View>
        <View style={styles.wifiContainer}>
          <View style={styles.wifiTitleContainer}>
            <Image
              source={require('../../../../assets/icons/icon-wifi.png')}
              style={[styles.sectionIcon, styles.wifiIcon]}
            />
            <Text style={styles.sectionTitle}>Wi-Fi</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#F15858' }}
            thumbColor={isWifiEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={() =>
              setIsWifiEnabled((previousState) => !previousState)
            }
            value={isWifiEnabled}
          />
        </View>

        {isWifiEnabled && (
          <View style={styles.expandableContent}>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBox}>
                {isLoadingWifi ? (
                  <ActivityIndicator size="small" color="#707070" />
                ) : (
                  <Text style={styles.ssid}>
                    {ssid !== null ? ssid : 'Wi-Fi 정보 없음'}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={fetchWifiInfo}
                style={styles.refreshButton}
              >
                <Image
                  source={require('../../../../assets/icons/icon-refresh.png')}
                  style={styles.refreshIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.wifiInfo}>
              <Text style={styles.wifiInfoEmoji}>⚠️</Text>
              <Text style={styles.wifiInfoMessage}>
                설정한 위치가 현재 위치일 때 Wi-Fi 정보를 확인할 수 있어요.
              </Text>
            </View>
          </View>
        )}
        <View style={[styles.wifiInfo, styles.wifiCheck]}>
          <Text style={styles.wifiInfoEmoji}>💡</Text>
          <Text style={styles.wifiInfoMessage}>
            Wi-Fi 정보를 사용하면 더 정확한 위치에서 알림을 받을 수 있어요.
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../../assets/icons/icon-privacy.png')}
            style={[styles.sectionIcon, styles.privacyIcon]}
          />
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>
        <SwitchSelector
          options={[
            { label: '비공개', value: '비공개' },
            { label: '공개', value: '공개' },
          ]}
          selected={privacyOption}
          onSelect={(value) => setPrivacyOption(value)}
        />
        {mode === 'edit' && (
          <View style={styles.deleteButtonWrap}>
            <DeleteButton style={styles.deleteButton} onPress={handleDelete} />
          </View>
        )}
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
  firstTitle: {
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  wifiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  wifiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wifiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  wifiCheck: {
    marginTop: -5,
    marginBottom: 0,
  },
  wifiInfoEmoji: {
    marginRight: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
  wifiInfoMessage: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#747474',
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
  mapMarker: {
    width: 45,
    height: 45,
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginBottom: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#202020',
  },
  pinIcon: {
    width: 22,
    height: 22,
    marginTop: -6,
    marginRight: 3,
  },
  expandableContent: {
    overflow: 'hidden',
  },
  textBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  refreshButton: {
    padding: 10,
    paddingRight: 15,
  },
  refreshIcon: {
    width: 22,
    height: 22,
  },
  ssid: {
    paddingHorizontal: 20,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#202020',
  },
  deleteButtonWrap: {
    marginTop: 40,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'static',
    left: 0,
    bottom: 0,
    marginLeft: 0,
  },
});
