import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { getLocationsWithTodos } from './firebaseService';

const GEOFENCING_TASK_NAME = 'geofencing-task';

TaskManager.defineTask(
  GEOFENCING_TASK_NAME,
  async ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    const [locationId, todoId, userId] = region.identifier.split('|');
    if (!userId) {
      console.error('userId not found in region identifier');
      return;
    }

    await sendLocationNotification(locationId, todoId, userId, eventType);
  },
);

let lastNotificationTime = 0;
const DEBOUNCE_INTERVAL = 60000;

const sendLocationNotification = async (
  locationId,
  todoId,
  userId,
  eventType,
) => {
  const now = Date.now();
  if (now - lastNotificationTime < DEBOUNCE_INTERVAL) {
    console.log('Notification debounced');
    return;
  }
  lastNotificationTime = now;

  const locations = await getLocationsWithTodos(userId);
  const location = locations[locationId];
  const todo = location.todos[todoId];

  const notificationId = `${locationId}_${todoId}_${eventType}`;

  if (location && todo) {
    const isEntering = eventType === Location.GeofencingEventType.Enter;
    const actionType = isEntering ? '도착' : '출발';
    const delaySeconds = todo.reminder.delayMinutes * 60;

    if (
      (isEntering && todo.reminder.reminderOnArrival) ||
      (!isEntering && !todo.reminder.reminderOnArrival)
    ) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: `${location.alias}에 ${actionType}했어요`,
          body: `${todo.title} 잊지마세요!`,
        },
        trigger: {
          seconds: delaySeconds > 0 ? delaySeconds : 1,
        },
      });
    }
  }
};

const startGeofencing = async (userId) => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    const locationsWithTodos = await getLocationsWithTodos(userId);

    const geofences = Object.values(locationsWithTodos).flatMap((location) =>
      Object.values(location.todos)
        .filter((todo) => todo.reminder && todo.reminder.isEnabled)
        .map((todo) => ({
          identifier: `${location.id}|${todo.id}|${userId}`,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 300,
          notifyOnEnter: todo.reminder.reminderOnArrival,
          notifyOnExit: !todo.reminder.reminderOnArrival,
        })),
    );

    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, geofences);
    console.log('Geofencing started with', geofences.length, 'locations');
  } else {
    console.log('위치 권한이 거부되었습니다');
  }
};

const setupGeofencing = async (userId) => {
  await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
  await startGeofencing(userId);
};

export { setupGeofencing };
