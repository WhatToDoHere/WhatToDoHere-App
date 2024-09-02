import { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { isGuestAtom, locationsAtom, userInfoAtom } from '../../../../atoms';

import * as firebaseService from '../../../../services/firebaseService';
import * as asyncStorageService from '../../../../services/asyncStorageService';

export default function CompletedTodo() {
  const navigation = useNavigation();
  const [locations, setLocations] = useAtom(locationsAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const [isGuest] = useAtom(isGuestAtom);
  const [friendsInfo, setFriendsInfo] = useState({});

  const completedTodos = useMemo(() => {
    return locations.flatMap((location) => {
      if (!location.todos || !Array.isArray(location.todos)) {
        return [];
      }
      return location.todos
        .filter((todo) => todo && todo.completed)
        .map((todo) => ({
          ...todo,
          locationId: location.id,
          locationAlias: location.alias,
          locationAddress: location.address,
        }));
    });
  }, [locations]);

  useEffect(() => {
    const fetchFriendsInfo = async () => {
      if (!isGuest) {
        const friendsData = {};
        for (const todo of completedTodos) {
          if (
            todo.assignedBy !== userInfo.uid &&
            !friendsData[todo.assignedBy]
          ) {
            try {
              const friendInfo = await firebaseService.getUserInfo(
                todo.assignedBy,
              );
              friendsData[todo.assignedBy] = friendInfo;
            } catch (error) {
              console.error('Error fetching friend info:', error);
            }
          }
        }
        setFriendsInfo(friendsData);
      }
    };

    fetchFriendsInfo();
  }, [completedTodos, userInfo.uid, isGuest]);

  const handleToggleComplete = async (locationId, todoId) => {
    try {
      if (isGuest) {
        await asyncStorageService.updateTodo(locationId, todoId, {
          completed: false,
        });
      } else {
        await firebaseService.updateTodo(locationId, todoId, {
          completed: false,
        });
      }

      setLocations((prevLocations) => {
        return prevLocations.map((location) => {
          if (location.id === locationId) {
            return {
              ...location,
              todos: location.todos.map((todo) =>
                todo.id === todoId ? { ...todo, completed: false } : todo,
              ),
            };
          }
          return location;
        });
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '완료 목록',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require('..../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.contents}>
        {completedTodos.length === 0 ? (
          <Text style={styles.noCompletedTodosText}>
            No completed tasks yet! 👀
          </Text>
        ) : (
          completedTodos.map((todo) => (
            <View key={todo?.id} style={styles.todoItem}>
              <TouchableOpacity
                onPress={() => handleToggleComplete(todo?.locationId, todo?.id)}
                style={styles.checkBox}
              >
                <Image
                  source={require('../../../../assets/icons/icon-checkbox-checked.png')}
                  style={styles.checkBoxImage}
                />
              </TouchableOpacity>
              <View style={styles.todoTextContainer}>
                <Text style={styles.todoTitle}>{todo?.title}</Text>
                <View style={styles.todoLocationContainer}>
                  <Text style={styles.todoLocationAlias}>
                    📍 {todo?.locationAlias}
                  </Text>
                  {todo?.locationAddress && (
                    <Text style={styles.todoLocationAddress}>
                      {' '}
                      - {todo?.locationAddress}
                    </Text>
                  )}
                </View>
                {!isGuest && todo.assignedBy !== userInfo.uid && (
                  <View style={styles.todoFriend}>
                    <Text>✍🏻 </Text>
                    <View style={styles.friendTag}>
                      <Text style={styles.friendName}>
                        {friendsInfo[todo.assignedBy]?.username}
                      </Text>
                    </View>
                    <Text style={styles.friendText}> 님이 작성하신 TODO</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#F15858',
  },
  backIcon: {
    width: 10,
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contents: {
    padding: 20,
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkBox: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  checkBoxImage: {
    width: 14,
    height: 14,
  },
  todoTextContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  todoTitle: {
    marginTop: 3,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  todoLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 13,
    color: '#707070',
  },
  todoLocationAlias: {
    marginTop: -3,
    fontFamily: 'Opposit-Bold',
    fontSize: 13,
    color: '#707070',
  },
  todoLocationAddress: {
    fontSize: 12,
    color: '#707070',
  },
  todoFriend: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingBottom: 4,
    backgroundColor: '#F15858',
    borderRadius: 8,
  },
  friendName: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 13,
    color: '#fff',
  },
  friendText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#707070',
  },
  noCompletedTodosText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
    color: '#707070',
  },
});
