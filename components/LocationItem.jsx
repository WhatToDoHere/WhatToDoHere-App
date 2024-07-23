import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from 'expo-router';

import TodoItem from './TodoItem';

export default function LocationItem({
  location,
  locationTitle,
  locationAddress,
  todos,
  backgroundColor,
}) {
  const [expanded, setExpanded] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

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

  const handleEditLocation = () => {
    navigation.navigate('location/index', {
      mode: 'edit',
      location: JSON.stringify(location),
    });
  };

  const handleAddTodo = () => {
    navigation.navigate('todo/index');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, expanded && styles.headerExpanded]}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.locationTitle}>{locationTitle}</Text>
          <Text style={styles.address}>📍 {locationAddress}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEditLocation}
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
        <View style={styles.addTodoItem}>
          <TouchableOpacity
            onPress={handleAddTodo}
            style={styles.addTodoContainer}
          >
            <Image
              source={require('../assets/icons/icon-checkbox-gray.png')}
              style={styles.checkBox}
            />
            <Text style={styles.addTodoText}>{'What to do here?'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 0,
    marginVertical: 10,
    backgroundColor: '#FDFCD8',
    borderRadius: 20,
    shadowColor: '#303030',
    borderWidth: 1,
    borderColor: '#303030',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
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
  locationTitle: {
    fontFamily: 'Opposit-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202020',
  },
  address: {
    marginTop: 8,
    fontFamily: 'Opposit-Regular',
    fontSize: 13,
    color: '#707070',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  toggleButton: {
    marginLeft: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
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
  addTodoItem: {},
  checkBox: {
    width: 14,
    height: 14,
    marginRight: 10,
    marginVertical: 10,
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTodoText: {
    flex: 1,
    marginTop: 2,
    fontFamily: 'Opposit-Regular',
    fontSize: 14,
    color: '#909090',
  },
});
