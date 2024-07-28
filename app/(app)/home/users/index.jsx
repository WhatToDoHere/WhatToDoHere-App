import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../../atoms';

export default function Profile() {
  const navigation = useNavigation();
  const [userInfo] = useAtom(userInfoAtom);

  const menuItems = [
    {
      id: 1,
      icon: require('../../../../assets/icons/icon-completed.png'),
      title: '완료 목록',
      link: 'users/completedTodo',
    },
    {
      id: 2,
      icon: require('../../../../assets/icons/icon-friends.png'),
      title: '친구 목록',
      link: 'users/friends',
    },
    {
      id: 3,
      icon: require('../../../../assets/icons/icon-add-friend.png'),
      title: '친구 추가',
      link: 'users/addFriend',
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
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
      <View style={styles.userHeader}>
        {userInfo && (
          <>
            <Image
              source={{ uri: userInfo.photoURL }}
              style={styles.userIcon}
            />
            <Text style={styles.welcomeText}>
              Hello, {userInfo.displayName} 👋
            </Text>
          </>
        )}
      </View>
      <ScrollView>
        <View style={styles.contents}>
          <View style={styles.userMenu}>
            {menuItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  navigation.navigate(item.link);
                }}
                style={styles.link}
              >
                <View style={styles.menuItem}>
                  <Image source={item.icon} style={styles.menuIcon} />
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    width: '100%',
    backgroundColor: '#fff',
  },
  contents: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
    borderRadius: 20,
  },
  welcomeText: {
    fontFamily: 'Opposit-Bold',
    fontSize: 24,
    color: '#202020',
  },
  menu: {
    marginTop: 20,
  },
  link: {
    textDecorationLine: 'none',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
});