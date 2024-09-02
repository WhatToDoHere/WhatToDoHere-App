import { useEffect } from 'react';
import { Stack } from 'expo-router';

import { useAtom } from 'jotai';
import { currentLocationAtom } from '../../../atoms';

import { requestAllPermissions } from '../../../utils/permission';
import { getCurrentLocation } from '../../../utils/location';

export default function AppLayout() {
  const [, setCurrentLocation] = useAtom(currentLocationAtom);

  useEffect(() => {
    setupPermissionsAndLocation();
  }, []);

  const setupPermissionsAndLocation = async () => {
    const permissions = await requestAllPermissions();

    if (permissions.foregroundLocation) {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    }
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="setupUsername" options={{ presentation: 'modal' }} />
      <Stack.Screen name="location/index" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="location/searchLocation"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="todo/index" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="todo/setReminderDetails"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="users/index" />
      <Stack.Screen
        name="users/signIn"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="users/completedTodo" />
      <Stack.Screen name="users/friends" />
      <Stack.Screen name="users/addFriend" />
      <Stack.Screen name="users/friendTodo" />
      <Stack.Screen name="users/settings" />
      <Stack.Screen name="users/changeUsername" />
    </Stack>
  );
}
