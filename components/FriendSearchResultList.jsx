import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function FriendSearchResultList({
  users,
  onSelectFriend,
  selectedFriends,
}) {
  const handlePress = (user) => {
    onSelectFriend(user);
  };

  return (
    <View>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={styles.item}
          onPress={() => handlePress(user)}
        >
          <Image
            source={
              user.photoURL
                ? { uri: user.photoURL }
                : require('../assets/icons/icon-user-default.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          {selectedFriends.some((friend) => friend.id === user.id) && (
            <Image
              source={require('../assets/icons/icon-check.png')}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#202020',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  email: {
    marginTop: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#aaa',
  },
  checkIcon: {
    width: 15,
    height: 14,
  },
});
