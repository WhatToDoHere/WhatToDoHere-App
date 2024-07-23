import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { useNavigation } from 'expo-router';

export default function TodoItem({
  title,
  details,
  image,
  onCheckBoxToggle,
  openTodoEditor,
}) {
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();

  const handleCheckBoxToggle = () => {
    setChecked(!checked);
    onCheckBoxToggle();
  };

  const handleEditTodo = () => {
    navigation.navigate('todo/index');
  };

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={handleCheckBoxToggle} style={styles.checkBox}>
        <Image
          source={
            checked
              ? require('../assets/icons/icon-checkbox-checked.png')
              : require('../assets/icons/icon-checkbox.png')
          }
          style={styles.checkBoxImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEditTodo} style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  checkBoxImage: {
    width: 14,
    height: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginTop: 2,
    fontFamily: 'Opposit-Regular',
    fontSize: 14,
    color: '#202020',
  },
});
