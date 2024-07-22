import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { useAtom } from 'jotai';
import { currentLocationAtom } from '../atoms';

import { getFullAddress } from '../utils/geocoding';
import { fetchPlaceDetails } from '../utils/api';

export default function GooglePlacesInput({ onPlaceSelected }) {
  const [currentLocation] = useAtom(currentLocationAtom);
  const [currentLocationItem, setCurrentLocationItem] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (currentLocation) {
        const address = await getFullAddress(
          currentLocation.latitude,
          currentLocation.longitude,
        );

        setCurrentLocationItem({
          description: `현재 위치: ${address}`,
          geometry: {
            location: {
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
            },
          },
        });
      }
    };

    fetchAddress();
  }, [currentLocation]);

  const handlePress = async (data) => {
    let location;

    if (data?.place_id) {
      location = await fetchPlaceDetails(data.place_id);
    } else if (data?.geometry?.location) {
      location = data.geometry.location;
    }

    if (location) {
      onPlaceSelected(location);
    }
  };

  const renderCustomRow = (data) => {
    const isCurrentLocation = data.description.startsWith('현재 위치');
    const iconSource = isCurrentLocation
      ? require('../assets/icons/icon-current-location.png')
      : require('../assets/icons/icon-searched-location.png');

    return (
      <View style={styles.resultRowContainer}>
        <TouchableOpacity
          style={styles.rowItem}
          onPress={() => handlePress(data)}
        >
          <Image source={iconSource} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{data.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/icon-search.png')}
        style={styles.searchIcon}
      />
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="위치 검색"
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
          language: 'ko',
          components: 'country:kr',
        }}
        predefinedPlaces={currentLocationItem ? [currentLocationItem] : []}
        predefinedPlacesAlwaysVisible={true}
        listViewDisplayed={true}
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        onFail={(error) => console.log(error)}
        renderRow={(data) => renderCustomRow(data)}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
          row: styles.resultRowContainer,
          listView: styles.listView,
          description: styles.description,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchIcon: {
    zIndex: 1,
    position: 'absolute',
    top: 15,
    left: 12,
    width: 16,
    height: 16,
    marginRight: 10,
  },
  resultRowContainer: {
    padding: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 0,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    flexShrink: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 24,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingBottom: 4,
    marginBottom: 0,
    borderRadius: 10,
    fontFamily: 'Pretendard-Regular',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  listView: {
    borderBottomWidth: 0,
    padding: 0,
  },
  description: {
    flex: 1,
  },
});
