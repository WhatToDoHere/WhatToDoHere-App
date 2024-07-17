import { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import LocationList from '../../../components/LocationList';
import AddLocationButton from '../../../components/AddLocationButton';

import { FRIENDS_DATA } from '../../../constants/user';

export default function FriendTodo() {
  const navigation = useNavigation();
  const { friendId } = useLocalSearchParams();
  const friend = FRIENDS_DATA.find((friend) => friend.id === friendId);

  useEffect(() => {
    if (friend) {
      navigation.setOptions({ title: `${friend.name}'s TODO` });
    }
  }, [navigation, friend]);

  const handleAdd = () => {
    navigation.navigate('location/index');
  };

  return (
    <View style={styles.container}>
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
                source={require('../../../assets/icons/icon-back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <LocationList
        locations={[
          { title: friend.name, address: friend.email, todos: friend.todos },
        ]}
      />
      <AddLocationButton onPress={handleAdd} />
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
    backgroundColor: '#fff',
  },
});
