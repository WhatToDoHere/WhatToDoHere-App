import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

import TodoItem from './TodoItem';

export default function LocationItem({
  locationTitle,
  locationAddress,
  todos,
  openLocationEditor,
  openTodoEditor,
}) {
  const [expanded, setExpanded] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const animation = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(rotation, {
        toValue: expanded ? 0 : 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setExpanded(!expanded);
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const handleCheckBoxToggle = (index) => {
    console.log(`Checkbox toggled for todo at index ${index}`);
  };

  const handleTodoEdit = (index, newTitle, newDetails, newImage) => {
    todos[index] = { title: newTitle, details: newDetails, image: newImage };
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, expanded && styles.headerExpanded]}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{locationTitle}</Text>
          <Text style={styles.address}>📍 {locationAddress}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={openLocationEditor}
            style={styles.editButton}
          >
            <Image
              source={require('../assets/icons/icon-edit.png')}
              style={styles.editIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
            <Animated.Image
              source={require('../assets/icons/icon-accordion.png')}
              style={[styles.arrowIcon, { transform: [{ rotate }] }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.todoList, { height }]}>
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            title={todo.title}
            details={todo.details}
            image={todo.image}
            onCheckBoxToggle={() => handleCheckBoxToggle(index)}
            openTodoEditor={() =>
              openTodoEditor(todo, (newTitle, newDetails, newImage) =>
                handleTodoEdit(index, newTitle, newDetails, newImage),
              )
            }
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 0,
    marginVertical: 10,
    backgroundColor: '#D0E9BC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 15,
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Opposit-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202020',
  },
  address: {
    marginTop: 8,
    fontFamily: 'Opposit-Bold',
    fontSize: 14,
    color: '#202020',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 10,
  },
  toggleButton: {
    marginLeft: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  arrowIcon: {
    width: 12,
    height: 6,
    marginTop: 6,
  },
  todoList: {
    marginTop: 15,
    overflow: 'hidden',
  },
});
