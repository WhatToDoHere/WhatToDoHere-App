import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { useNavigation } from 'expo-router';

export default function TodoItem({ todo, onCheckBoxToggle }) {
  const [checked, setChecked] = useState(todo.completed);
  const navigation = useNavigation();

  const handleCheckBoxToggle = async () => {
    const newCompletedState = !checked;
    setChecked(newCompletedState);
    await onCheckBoxToggle(todo.id, newCompletedState);
  };

  const handleEditTodo = () => {
    navigation.navigate('todo/index', {
      mode: 'edit',
      locationId: todo.locationId,
      todoId: todo.id,
    });
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
        <Text style={styles.title}>{todo.title}</Text>
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
