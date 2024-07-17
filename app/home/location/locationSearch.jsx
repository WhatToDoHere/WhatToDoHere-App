import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

export default function LocationSearch() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '위치 검색',
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
                navigation.goBack();
              }}
            >
              <Text style={styles.headerRight}>저장</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <Text>locationSearch</Text>
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
});
