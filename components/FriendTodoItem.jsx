import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';

export default function FriendTodoItem({ todo }) {
  const navigation = useNavigation();

  const handleEditTodo = () => {
    if (!todo.completed) {
      navigation.navigate('todo/index', {
        mode: 'edit',
        locationId: todo.locationId,
        todoId: todo.id,
        isFriendTodo: true,
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={handleEditTodo}
      disabled={todo.completed}
    >
      <View style={styles.checkBox}>
        <Image
          source={
            todo.completed
              ? require('../assets/icons/icon-checkbox-checked.png')
              : require('../assets/icons/icon-checkbox.png')
          }
          style={styles.checkBoxImage}
        />
      </View>
      <Text style={[styles.title, todo.completed && styles.completedTitle]}>
        {todo.title}
      </Text>
    </TouchableOpacity>
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
  title: {
    flex: 1,
    marginTop: 2,
    fontFamily: 'Opposit-Regular',
    fontSize: 14,
    color: '#202020',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#707070',
  },
});
