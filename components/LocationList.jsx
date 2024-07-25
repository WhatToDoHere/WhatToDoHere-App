import { ScrollView, StyleSheet } from 'react-native';

import LocationItem from './LocationItem';

export default function LocationList({ locations }) {
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return '#D0E7FD';
      case 1:
        return '#FDFCD8';
      default:
        return '#FFF7F9';
    }
  };
  console.log(locations);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((location, index) => (
        <LocationItem
          key={location.id}
          location={location}
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
