import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import LocationItem from './LocationItem';

export default function LocationList({ openTodoEditor }) {
  const [locations, setLocations] = useState([
    {
      title: 'Home',
      address: '123 Home St.',
      todos: [
        {
          title: '알고리즘 풀기',
          details: 'Sweep and mop the floors.',
          image: 'https://example.com/clean-house.jpg',
        },
        {
          title: '세탁기 돌리기',
          details: 'Wash and fold clothes.',
          image: 'https://example.com/do-laundry.jpg',
        },
      ],
    },
    {
      title: 'Work',
      address: '456 Work Ave.',
      todos: [
        {
          title: '회의록 작성하기',
          details: 'Complete the project documentation.',
          image: 'https://example.com/finish-project.jpg',
        },
        {
          title: '클라이언트에게 이메일 보내기',
          details: 'Send the project updates to the client.',
          image: 'https://example.com/email-client.jpg',
        },
      ],
    },
    {
      title: 'Gym',
      address: '789 Gym Rd.',
      todos: [
        {
          title: 'Workout',
          details: 'Complete the strength training routine.',
          image: 'https://example.com/workout.jpg',
        },
        {
          title: 'Swim',
          details: 'Swim 30 laps.',
          image: 'https://example.com/swim.jpg',
        },
      ],
    },
  ]);

  const openLocationEditor = (index) => {
    router.push({
      pathname: '/home/location',
      params: locations[index],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locations.map((location, index) => (
        <LocationItem
          key={index}
          locationTitle={location.title}
          locationAddress={location.address}
          todos={location.todos}
          openLocationEditor={() => openLocationEditor(index)}
          openTodoEditor={openTodoEditor}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
