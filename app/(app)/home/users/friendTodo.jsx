import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, currentFriendLocationsAtom } from '../../../../atoms';

import { getLocationsByUserId } from '../../../../services/firebaseService';

import FriendLocationList from '../../../../components/FriendLocationList';

export default function FriendTodo() {
  const navigation = useNavigation();
  const { friendId, friendName } = useLocalSearchParams();
  const [userInfo] = useAtom(userInfoAtom);
  const [currentFriendLocations, setCurrentFriendLocations] = useAtom(
    currentFriendLocationsAtom,
  );
  const [isLoading, setIsLoading] = useState(true);

  console.log(friendName);
  useEffect(() => {
    const fetchFriendData = async () => {
      setIsLoading(true);
      try {
        const allFriendLocations = await getLocationsByUserId(friendId);

        const publicFriendLocations = allFriendLocations.filter(
          (location) => location.privacy === 'public',
        );

        setCurrentFriendLocations(publicFriendLocations);
      } catch (error) {
        console.error('Error fetching friend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendData();

    return () => {
      setCurrentFriendLocations([]);
    };
  }, [friendId, userInfo.uid, setCurrentFriendLocations]);

  console.log('친구의 locations', currentFriendLocations);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>Loading...⏱️</Text>
        </View>
      );
    } else if (currentFriendLocations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>No public location 🙈</Text>
        </View>
      );
    } else {
      return <FriendLocationList locations={currentFriendLocations} />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${friendName}님의 할 일 목록`,
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
      {renderContent()}
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
  loadingText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
    color: '#707070',
  },
  messageText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Opposit-Regular',
    fontSize: 18,
    color: '#707070',
  },
});
