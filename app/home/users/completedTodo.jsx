import { useMemo } from 'react';
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
import { locationsAtom, userInfoAtom } from '../../../atoms';

export default function CompletedTodo() {
  const navigation = useNavigation();
  const [locations] = useAtom(locationsAtom);
  const [userInfo] = useAtom(userInfoAtom);

  const completedTodos = useMemo(() => {
    return locations.flatMap((location) =>
      location.todos
        ?.filter((todo) => todo.completed)
        .map((todo) => ({
          ...todo,
          locationAlias: location.alias,
          locationAddress: location.address,
        })),
    );
  }, [locations]);

  const handleToggleComplete = (locationId, todoId) => {
    // TODO: 완료 상태를 토글하는 로직 구현
    // updateTodo 함수를 호출하여 Firestore와 전역 상태를 업데이트
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
                source={require('../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.contents}>
        {completedTodos.map((todo) => (
          <View key={todo.id} style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => handleToggleComplete(todo.locationId, todo.id)}
              style={styles.checkBox}
            >
              <Image
                source={require('../../../assets/icons/icon-checkbox-checked.png')}
                style={styles.checkBoxImage}
              />
            </TouchableOpacity>
            <View style={styles.todoTextContainer}>
              <Text style={styles.todoTitle}>{todo.title}</Text>
              <Text style={styles.todoLocation}>
                📍 {todo.locationAlias} - {todo.locationAddress}
              </Text>
              {todo.assignedBy !== userInfo.uid && (
                <View style={styles.todoFriend}>
                  <Text>✍🏻 </Text>
                  <View style={styles.friendTag}>
                    <Text style={styles.friendName}>{todo.friendName}</Text>
                  </View>
                  <Text style={styles.friendText}> 님이 작성하신 TODO</Text>
                </View>
              )}
            </View>
          </View>
        ))}
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
  todoLocation: {
    marginTop: 15,
    fontSize: 13,
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
});
