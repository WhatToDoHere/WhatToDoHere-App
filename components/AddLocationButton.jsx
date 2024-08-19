import { StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function AddLocationButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onPress}
      testID="add-location-button"
    >
      <Image
        source={require('../assets/icons/icon-add.png')}
        style={styles.addIcon}
        testID="add-location-icon"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#202020',
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
});
