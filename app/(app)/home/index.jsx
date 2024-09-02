import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom, isGuestAtom } from '../../../atoms';

import Header from '../../../components/Header';
import LocationList from '../../../components/LocationList';
import AddLocationButton from '../../../components/AddLocationButton';

import * as firebaseService from '../../../services/firebaseService';
import * as asyncStorageService from '../../../services/asyncStorageService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userInfo] = useAtom(userInfoAtom);
  const [locations, setLocations] = useAtom(locationsAtom);
  const [isGuest] = useAtom(isGuestAtom);

  useEffect(() => {
    const fetchLocations = async () => {
      if (isGuest) {
        const guestLocations = await asyncStorageService.getLocations();
        setLocations(guestLocations);
      } else if (userInfo) {
        const fetchedLocations = await firebaseService.getLocationsByUserId(
          userInfo.uid,
        );
        setLocations(fetchedLocations);
      }
    };

    fetchLocations();
  }, [isGuest, userInfo, setLocations]);

  const handleAddLocation = () => {
    navigation.navigate('location/index', { mode: 'add' });
  };

  return (
    <View style={styles.container}>
      <Header userInfo={userInfo} />
      <LocationList locations={locations}></LocationList>
      <AddLocationButton onPress={handleAddLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
