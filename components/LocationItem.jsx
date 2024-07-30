import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { locationsAtom } from '../atoms';

import TodoItem from './TodoItem';

import { updateTodo } from '../services/firebaseService';
import { TODO_ITEM_HEIGHT, ADD_TODO_ITEM_HEIGHT } from '../constants/todo';

export default function LocationItem({ location, backgroundColor }) {
  const [, setLocations] = useAtom(locationsAtom);

  const [expanded, setExpanded] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  const calculateMaxHeight = () => {
    const uncompletedTodosCount =
      location.todos?.filter((todo) => !todo.completed).length || 0;
    return uncompletedTodosCount * TODO_ITEM_HEIGHT + ADD_TODO_ITEM_HEIGHT;
  };

  const [maxHeight, setMaxHeight] = useState(calculateMaxHeight());

  useEffect(() => {
    setMaxHeight(calculateMaxHeight());
  }, [location.todos]);

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
    outputRange: [0, maxHeight],
  });

  const handleCheckBoxToggle = async (todoId, newCompletedState) => {
    try {
      await updateTodo(
        location.id,
        todoId,
        { completed: newCompletedState },
        setLocations,
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEditLocation = () => {
    navigation.navigate('location/index', {
      mode: 'edit',
      location: JSON.stringify(location),
    });
  };

  const handleAddTodo = () => {
    navigation.navigate('todo/index', {
      mode: 'add',
      locationId: location.id,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, expanded && styles.headerExpanded]}>
        <View style={styles.headerFlexContainer}>
          <Text style={styles.locationAlias}>{location.alias}</Text>
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
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.toggleButton}
            >
              <Animated.Image
                source={require('../assets/icons/icon-accordion.png')}
                style={[styles.arrowIcon, { transform: [{ rotate }] }]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.address}>
          📍 {location.address ?? '위치를 설정해 주세요!'}
        </Text>
      </View>
      <Animated.View style={[styles.todoListContainer, { height }]}>
        <View style={styles.todoListContent}>
          {location.todos
            ?.filter((todo) => !todo.completed)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onCheckBoxToggle={handleCheckBoxToggle}
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
              <Text style={styles.addTodoText}>What to do here?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FDFCD8',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#9c9b9b67',
  },
  headerFlexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationAlias: {
    fontFamily: 'Opposit-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202020',
  },
  address: {
    marginTop: 2,
    marginBottom: 15,
    fontFamily: 'Opposit-Regular',
    fontSize: 13,
    color: '#707070',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 10,
    marginTop: 2,
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
  todoListContainer: {
    overflow: 'hidden',
  },
  todoListContent: {
    marginTop: 15,
  },
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
