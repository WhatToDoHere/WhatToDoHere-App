import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { FRIENDS_DATA } from '../../../../constants/user';

export default function Friends() {
  const navigation = useNavigation();

  const handlePress = (friendId) => {
    navigation.navigate('users/friendTodo', { friendId });
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '친구 목록',
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
                source={require('../../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.contents}>
        {FRIENDS_DATA.map((friend) => (
          <View key={friend.id} style={styles.item}>
            <Image source={{ uri: friend.profileIcon }} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{friend.name}</Text>
              <Text style={styles.email}>{friend.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePress(friend.id)}
              style={styles.todoButton}
            >
              <Text style={styles.todoButtonText}>TODO</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  contents: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  email: {
    marginTop: 4,
    fontFamily: 'Pretendard-Regular',
    fontSize: 11,
    color: '#aaa',
  },
  todoButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#202020',
    borderRadius: 5,
  },
  todoButtonText: {
    color: '#fff',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
});
