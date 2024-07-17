import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import SearchBar from '../../../components/SearchBar';
import SearchResultList from '../../../components/SearchResultList';

import { USER_DATA } from '../../../constants/user';

export default function AddFriend() {
  const navigation = useNavigation();
  const [filteredItems, setFilteredItems] = useState(USER_DATA);

  const handleSearch = (text) => {
    const filtered = USER_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredItems(filtered);
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
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.headerLeft}>취소</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log('위치 저장');
                navigation.goBack();
              }}
            >
              <Text style={styles.headerRight}>완료</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <SearchBar
          placeholder="검색어를 입력하세요"
          onSearch={handleSearch}
          style={styles.searchBar}
        />
        <SearchResultList items={filteredItems} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#F15858',
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
});
