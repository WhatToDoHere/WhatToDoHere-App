import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom } from '../../atoms';

import Header from '../../components/Header';
import LocationList from '../../components/LocationList';
import AddLocationButton from '../../components/AddLocationButton';

import { getLocationsByUserId } from '../../utils/firebaseService';

export default function HomeScreen() {
  const [userInfo] = useAtom(userInfoAtom);
  const [locations, setLocations] = useAtom(locationsAtom);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocations = async () => {
      if (userInfo) {
        const fetchedLocations = await getLocationsByUserId(userInfo.uid);

        setLocations(fetchedLocations);
      }
    };

    fetchLocations();
  }, [userInfo, setLocations]);

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
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
