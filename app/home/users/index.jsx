import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Stack, useNavigation } from 'expo-router';

export default function Profile() {
  const navigation = useNavigation();

  return (
    <View>
      <Stack.Screen
        options={{
          title: '',
          options: { headerBackTitleVisible: false },
          headerLeft: () => (
            <TouchableOpacity
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
        }}
      />
      <Text>사용자</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    padding: 10,
    fontSize: 16,
    color: '#F15858',
  },
  backIcon: {
    width: 10,
    height: 20,
  },
});
