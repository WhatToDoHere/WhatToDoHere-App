import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

export default function LocationModal() {
  const { address } = useLocalSearchParams();
  const navigation = useNavigation();

  return (
    <View>
      <Stack.Screen
        options={{
          title: '📍 위치 설정',
          headerStyle: { fontFamily: 'Pretendard-Regular', fontSize: 10 },
          headerTintColor: '#202020',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 18,
          },
          headerBackVisible: true,
          headerBackTitle: 'Custom Back',
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
      <Text>{address}</Text>
    </View>
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
});
