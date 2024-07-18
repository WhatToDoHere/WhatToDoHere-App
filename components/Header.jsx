import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Header({ isLoggedIn }) {
  return (
    <View style={styles.header}>
      <Link href="/" style={styles.title}>
        📍WhatToDoHere
      </Link>
      {isLoggedIn ? (
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => router.push({ pathname: '/home/users' })}
        ></TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Text style={styles.loginButton}>Log in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Opposit-Bold',
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: 'tomato',
  },
  loginButton: {
    fontSize: 18,
    fontFamily: 'Opposit-bold',
  },
});
