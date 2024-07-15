import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import Header from '../../components/Header';
import LocationList from '../../components/LocationList';

export default function HomeScreen() {
  const isLoggedIn = true;

  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} />

      <LocationList></LocationList>

      <TouchableOpacity style={styles.addButton}>
        {/* <MaterialIcons name="add" size={24} color="white" /> */}
      </TouchableOpacity>
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
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
