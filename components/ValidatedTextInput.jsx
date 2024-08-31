import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';

export default function ValidatedTextInput({
  value,
  onChangeText,
  placeholder,
  validateInput,
  onValidationChange,
  multiline = false,
}) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const validate = async () => {
      if (value.length > 0) {
        setIsValidating(true);

        const validationError = await validateInput(value);

        setIsValid(validationError === null);
        setErrorMessage(validationError || '');
        setIsValidating(false);
        onValidationChange(validationError === null);
      } else {
        setIsValid(false);
        setErrorMessage('');
        onValidationChange(false);
      }
    };

    const debounce = setTimeout(() => {
      validate();
    }, 300);

    return () => clearTimeout(debounce);
  }, [value, validateInput]);

  return (
    <View>
      <View
        style={[
          styles.container,
          multiline && styles.multilineContainer,
          !isValid && errorMessage && styles.invalidContainer,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
        />
        {value.length > 0 && (
          <View style={styles.iconContainer}>
            {isValidating ? (
              <ActivityIndicator size="small" color="#999" />
            ) : isValid ? (
              <Image
                source={require('../assets/icons/icon-check-validation.png')}
                style={styles.icon}
              />
            ) : null}
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={styles.clearButton}
            >
              <Image
                source={require('../assets/icons/icon-clear.png')}
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.errorContainer}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#EEEEEE',
  },
  invalidContainer: {
    borderColor: '#F15858',
  },
  multilineContainer: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    padding: 10,
    height: 40,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#202020',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  clearButton: {
    padding: 10,
  },
  clearIcon: {
    width: 15,
    height: 15,
  },
  errorContainer: {
    minHeight: 45,
  },
  errorText: {
    color: '#F15858',
    fontSize: 12,
    marginVertical: 5,
    fontFamily: 'Pretendard-Regular',
  },
});
