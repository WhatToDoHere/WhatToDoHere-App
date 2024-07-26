import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function TimePicker({
  selectedHours,
  selectedMinutes,
  onTimeChange,
}) {
  const handleHoursChange = (itemValue) => {
    onTimeChange(itemValue, selectedMinutes);
  };

  const handleMinutesChange = (itemValue) => {
    onTimeChange(selectedHours, itemValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedHours}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={handleHoursChange}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item
                key={`hour-${i}`}
                label={i.toString()}
                value={i.toString()}
              />
            ))}
          </Picker>
          <Text style={styles.pickerLabel}>시간</Text>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMinutes}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={handleMinutesChange}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item
                key={`min-${i}`}
                label={i.toString().padStart(2, '0')}
                value={i.toString()}
              />
            ))}
          </Picker>
          <Text style={styles.pickerLabel}>분</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  pickerWrapper: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 100,
    height: 200,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 20,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  pickerLabel: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 5,
  },
});
