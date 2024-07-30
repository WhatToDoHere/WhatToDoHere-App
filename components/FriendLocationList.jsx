import { ScrollView, StyleSheet } from 'react-native';
import FriendLocationItem from './FriendLocationItem';

import { getBackgroundColor } from '../utils/location';

export default function FriendLocationList({ locations }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((location, index) => (
        <FriendLocationItem
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
    paddingTop: 10,
  },
});
