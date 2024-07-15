import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import LocationItem from './LocationItem';

const LocationList = () => {
  const [locations, setLocations] = useState([
    {
      title: 'Home',
      address: '123 Home St.',
      todos: ['Clean the house', 'Do the laundry'],
    },
    {
      title: 'Work',
      address: '456 Work Ave.',
      todos: ['Finish project', 'Email client'],
    },
    {
      title: 'Gym',
      address: '789 Gym Rd.',
      todos: ['Workout', 'Swim'],
    },
  ]);

  const handleEdit = (index) => {
    // 수정 로직
    console.log(`Edit location at index ${index}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((location, index) => (
        <LocationItem
          key={index}
          locationTitle={location.title}
          locationAddress={location.address}
          todos={location.todos}
          onEdit={() => handleEdit(index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default LocationList;
