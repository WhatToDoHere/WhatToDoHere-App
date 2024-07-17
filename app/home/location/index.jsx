import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import SearchBar from '../../../components/SearchBar';
import SwitchSelector from '../../../components/SwitchSelector';
import TitleInput from '../../../components/TitleInput';

export default function LocationEditor() {
  const { address } = useLocalSearchParams();
  const navigation = useNavigation();

  const [alertOption, setAlertOption] = useState('도착할 때');
  const [privacyOption, setPrivacyOption] = useState('공개');
  const [locationTitle, setLocationTitle] = useState('바닐라 코딩');

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
        <TitleInput value={locationTitle} onChangeText={setLocationTitle} />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-location.png')}
            style={[styles.sectionIcon, styles.locationIcon]}
          />
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
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
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-wifi.png')}
            style={[styles.sectionIcon, styles.wifiIcon]}
          />
          <Text style={styles.sectionTitle}>WiFi</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.ssid}>Vanilla_coding</Text>
        </View>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-alert.png')}
            style={[styles.sectionIcon, styles.alertIcon]}
          />
          <Text style={styles.sectionTitle}>Alert</Text>
        </View>
        <SwitchSelector
          options={['도착할 때', '떠날 때']}
          selected={alertOption}
          onSelect={(option) => setAlertOption(option)}
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-privacy.png')}
            style={[styles.sectionIcon, styles.privacyIcon]}
          />
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  locationIcon: {
    width: 14,
    height: 16,
  },
  wifiIcon: {
    width: 16,
    height: 12,
  },
  alertIcon: {
    width: 14,
    height: 15,
  },
  privacyIcon: {
    width: 18,
    height: 18,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Opposit-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
  },
  map: {
    alignItems: 'center',
    width: '100%',
    height: 300,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#303030',
  },
  searchBar: {
    width: '94%',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  address: {
    marginBottom: 15,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  textBox: {
    justifyContent: 'center',
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#303030',
  },
  ssid: {
    paddingHorizontal: 20,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#fff',
  },
});
