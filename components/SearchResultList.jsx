import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchResultList({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePress = (item) => {
    setSelectedItem(item.id === selectedItem ? null : item.id);
  };

  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => handlePress(item)}
        >
          <Image source={item.icon} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          {selectedItem === item.id && (
            <Image
              source={require('../assets/icons/icon-check.png')}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  description: {
    marginTop: 4,
    fontFamily: 'Pretendard-Regular',
    fontSize: 11,
    color: '#aaa',
  },
  checkIcon: {
    width: 15,
    height: 14,
  },
});
