import { Stack } from 'expo-router/stack';

export default function LootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="location/index" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="location/searchLocation"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="users/index" />
      <Stack.Screen
        name="users/completedTodo"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="users/friends" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="users/addFriend"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}