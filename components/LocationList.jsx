import { ScrollView, StyleSheet } from 'react-native';

import LocationItem from './LocationItem';
import { getBackgroundColor } from '../utils/location';

export default function LocationList({ locations }) {
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
    paddingTop: 5,
  },
});
