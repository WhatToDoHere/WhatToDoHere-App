import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function TitleInput({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Image
            source={require('../assets/icons/icon-clear.png')}
            style={styles.clearIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
  },
  input: {
    flex: 1,
    lineHeight: 30,
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
    textShadowColor: 'rgba(241, 88, 88, 0.9)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 10,
  },
  clearButton: {
    padding: 10,
    paddingTop: 15,
  },
  clearIcon: {
    width: 15,
    height: 15,
  },
});
