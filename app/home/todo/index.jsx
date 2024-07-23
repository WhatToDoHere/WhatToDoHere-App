import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

export default function AddTodo() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '작업 추가',
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
                navigation.goBack();
              }}
            >
              <Text style={styles.headerRight}>완료</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <TextInput style={styles.input} placeholder="Todo" />
        <TextInput style={styles.input} placeholder="Details" />
        <TextInput style={styles.input} placeholder="Image URL" />
        {/* {image ? <Image source={{ uri: image }} style={styles.image} /> : null} */}
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
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
});
