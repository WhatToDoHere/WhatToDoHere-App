import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export function CustomTextInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
}) {
  return (
    <View style={[styles.container, multiline && styles.multilineContainer]}>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
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
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    marginBottom: 10,
  },
  multilineContainer: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#202020',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  clearButton: {
    padding: 10,
  },
  clearIcon: {
    width: 15,
    height: 15,
  },
});
