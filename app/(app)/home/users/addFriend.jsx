import { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../../atoms';

import SearchBar from '../../../../components/SearchBar';
import FriendSearchResultList from '../../../../components/FriendSearchResultList';
import {
  searchUsersByUsername,
  addFriend,
} from '../../../../services/firebaseService';

export default function AddFriend() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text) => {
    if (text.length > 0) {
      const results = await searchUsersByUsername(text);
      const filteredResults = results.filter(
        (user) =>
          user.uid !== userInfo.uid && !userInfo.friends.includes(user.uid),
      );

      setSearchResults(filteredResults);
      setHasSearched(true);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleSelectFriend = (user) => {
    setSelectedFriends((prev) => {
      if (prev.some((friend) => friend.uid === user.uid)) {
        return prev.filter((friend) => friend.uid !== user.uid);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAddFriends = async () => {
    try {
      let updatedUserInfo = { ...userInfo };
      for (const friend of selectedFriends) {
        const updatedUser = await addFriend(userInfo.uid, friend.uid);
        updatedUserInfo = { ...updatedUserInfo, ...updatedUser };
      }
      setUserInfo(updatedUserInfo);
      Alert.alert('성공', '친구 추가가 완료되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('친구 추가 오류:', error);
      Alert.alert('오류', '친구 추가 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '친구 추가',
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
          headerRight: () => (
            <TouchableOpacity onPress={handleAddFriends}>
              <Text style={styles.headerRight}>완료</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.contents}>
        <SearchBar
          placeholder="사용자 이름을 입력하세요."
          onSearch={handleSearch}
          style={styles.searchBar}
        />
        <View style={styles.searchResultContainer}>
          {hasSearched && searchResults.length === 0 ? (
            <Text style={styles.noResultText}>No results found 🧐</Text>
          ) : (
            <FriendSearchResultList
              users={searchResults}
              onSelectFriend={handleSelectFriend}
              selectedFriends={selectedFriends}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
  },
  backIcon: {
    width: 10,
    height: 20,
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  contents: {
    paddingBottom: 100,
  },
  searchBar: {
    marginBottom: 20,
  },
  searchResultContainer: {
    marginTop: 20,
  },
  noResultText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
    color: '#707070',
  },
});
