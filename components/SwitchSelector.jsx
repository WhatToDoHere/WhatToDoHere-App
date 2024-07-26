import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

export default function SwitchSelector({ options, selected, onSelect }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [switchWidth, setSwitchWidth] = useState(0);

  const optionWidth = switchWidth / options.length + 10;

  useEffect(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === selected,
    );
    Animated.timing(animatedValue, {
      toValue: selectedIndex,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected, animatedValue, options]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, options.length - 1],
    outputRange: [0, switchWidth - optionWidth],
  });

  return (
    <View
      style={styles.switchContainer}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setSwitchWidth(width);
      }}
    >
      <Animated.View
        style={[
          styles.animatedBackground,
          { width: optionWidth - 10, transform: [{ translateX }] },
        ]}
      />
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => onSelect && onSelect(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              selected === option.value
                ? styles.selectedOptionText
                : styles.unselectedOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    padding: 5,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  animatedBackground: {
    position: 'absolute',
    left: 5,
    top: 5,
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  selectedOptionText: {
    color: '#202020',
  },
  unselectedOptionText: {
    color: '#707070',
  },
});
