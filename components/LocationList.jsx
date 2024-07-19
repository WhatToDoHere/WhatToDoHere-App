import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import LocationItem from './LocationItem';

export default function LocationList({ openTodoEditor }) {
  const [locations, setLocations] = useState([
    {
      title: 'Home',
      address: '서울시 성동구 독서당로 166',
      todos: [
        {
          title: '분리수거 하기',
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
      address: '서울시 강남구 대치 2동 테헤란로 522',
      todos: [
        {
          title: '알고리즘 풀기',
          details: 'Complete the project documentation.',
          image: 'https://example.com/finish-project.jpg',
        },
        {
          title: '명재님께 질문하기',
          details: 'Send the project updates to the client.',
          image: 'https://example.com/email-client.jpg',
        },
      ],
    },
    {
      title: 'Gym',
      address: '서울시 용산구 한남대로 173',
      todos: [
        {
          title: '스쿼트 100개',
          details: 'Complete the strength training routine.',
          image: 'https://example.com/workout.jpg',
        },
        {
          title: '러닝머신 30분',
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

  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return '#D0E9BC';
      case 1:
        return '#FDFCD8';
      default:
        return '#FFF7F9';
    }
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
          backgroundColor={getBackgroundColor(index)}
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
