import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({ isLoggedIn }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>📍WhatToDoHere</Text>
      {isLoggedIn ? (
        <TouchableOpacity style={styles.profileIcon}></TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
