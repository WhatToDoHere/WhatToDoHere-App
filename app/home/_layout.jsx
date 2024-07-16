import { Stack } from 'expo-router/stack';

export default function LootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="location/index" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="location/locationSearch"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="users/index"
        // options={{ headerTitle: '', headerBackTitleVisible: false }}
      />
    </Stack>
  );
}
