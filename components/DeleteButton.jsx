import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function DeleteButton({ onPress, style }) {
  return (
    <TouchableOpacity style={[styles.deleteButton, style]} onPress={onPress}>
      <Image
        source={require('../assets/icons/icon-delete.png')}
        style={styles.deleteIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    left: '50%',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginLeft: -25,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F15858',
    shadowColor: '#707070',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  deleteIcon: {
    width: 22,
    height: 22,
  },
});
