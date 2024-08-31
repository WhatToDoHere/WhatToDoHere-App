import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../atoms';

import { getFriendsList } from '../services/firebaseService';

export default function FriendsList() {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await getFriendsList(userInfo.uid);
      setFriends(friendsData);
      setIsLoading(false);
    };

    fetchFriends();
  }, [userInfo.uid]);

  const handlePress = (friendId, friendName) => {
    navigation.navigate('users/friendTodo', { friendId, friendName });
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={
          item.photoURL
            ? { uri: item.photoURL }
            : require('../assets/icons/icon-user-default.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handlePress(item.id, item.username)}
        style={styles.todoButton}
      >
        <Text style={styles.todoButtonText}>TODO</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <Text style={styles.infoText}>Loading friends...👯</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.infoText}>No friends found ☹️</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#202020',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  friendEmail: {
    marginTop: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#aaa',
  },
  todoButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    paddingTop: 8,
    backgroundColor: '#202020',
    borderRadius: 20,
  },
  todoButtonText: {
    fontFamily: 'Opposit-Bold',
    fontSize: 15,
    color: '#fff',
  },
  infoText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
    color: '#707070',
  },
});
