import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import SearchBar from '../../../components/SearchBar';
import SwitchSelector from '../../../components/SwitchSelector';

export default function LocationEditor() {
  const { address } = useLocalSearchParams();
  const navigation = useNavigation();

  const [alertOption, setAlertOption] = useState('도착할 때');
  const [privacyOption, setPrivacyOption] = useState('공개');

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '위치 설정',
          headerStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 10,
          },
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
              }}
            >
              <Text style={styles.headerRight}>저장</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <TextInput style={styles.locationTitle} value="바닐라 코딩" />
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.map}>
          <Pressable
            onPress={() => {
              navigation.navigate('location/locationSearch');
            }}
          >
            <SearchBar
              style={styles.searchBar}
              placeholder="위치 검색"
              onSearch={(text) => console.log('검색:', text)}
              editable={false}
            />
          </Pressable>
        </View>
        <Text style={styles.address}>📍 {address}</Text>
        <Text style={styles.sectionTitle}>WiFi</Text>
        <Text>Vanilla_coding</Text>
        <Text style={styles.sectionTitle}>Alert</Text>
        <SwitchSelector
          options={['도착할 때', '떠날 때']}
          selected={alertOption}
          onSelect={(option) => setAlertOption(option)}
        />
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SwitchSelector
          options={['공개', '비공개']}
          selected={privacyOption}
          onSelect={(option) => setPrivacyOption(option)}
        />
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
  locationTitle: {
    paddingTop: 10,
    fontFamily: 'Opposit-Regular',
    fontSize: 20,
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontFamily: 'Opposit-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
  },
  map: {
    alignItems: 'center',
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#303030',
  },
  searchBar: {
    width: '94%',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  address: {
    marginBottom: 16,
  },
});
