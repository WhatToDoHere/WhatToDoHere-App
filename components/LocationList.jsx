import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';

import LocationItem from './LocationItem';

export default function LocationList({ locations }) {
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return '#D0E9BC';
      case 1:
        return '#FDFCD8';
      default:
        return '#FFF7F9';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((location, index) => (
        <LocationItem
          key={location.id}
          location={location}
          locationTitle={location.alias}
          locationAddress={location.address}
          todos={location.todos || []}
          backgroundColor={getBackgroundColor(index)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
