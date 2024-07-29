import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { getLocationsWithTodos } from './firebaseService';

const GEOFENCING_TASK_NAME = 'geofencing-task';

TaskManager.defineTask(
  GEOFENCING_TASK_NAME,
  async ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error('Geofencing task error:', error);
      return;
    }

    console.log(`Geofencing event: ${eventType} for region:`, region);

    const [locationId, todoId, userId] = region.identifier.split('|');
    if (!userId) {
      console.error('userId not found in region identifier');
      return;
    }

    await sendLocationNotification(locationId, todoId, userId, eventType);
  },
);

const lastNotificationTimes = {};
const DEBOUNCE_INTERVAL = 60000; // 60초

const sendLocationNotification = async (
  locationId,
  todoId,
  userId,
  eventType,
) => {
  const now = Date.now();
  const lastTime = lastNotificationTimes[locationId] || 0;

  console.log(`Checking notification for location ${locationId}:`);
  console.log(`Last notification time: ${new Date(lastTime).toISOString()}`);
  console.log(`Current time: ${new Date(now).toISOString()}`);
  console.log(`Time difference: ${now - lastTime}ms`);

  if (now - lastTime < DEBOUNCE_INTERVAL) {
    console.log(`Notification debounced for location ${locationId}`);
    return;
  }

  lastNotificationTimes[locationId] = now;

  console.log(`Sending notification for location ${locationId}`);

  try {
    const locations = await getLocationsWithTodos(userId);
    const location = locations[locationId];
    const todo = location?.todos?.[todoId];

    if (!location || !todo) {
      console.error('Location or todo not found');
      return;
    }

    const appName = 'WhatToDoHere';
    const notificationId = `${locationId}_${todoId}_${eventType}`;

    const isEntering = eventType === Location.GeofencingEventType.Enter;
    const delaySeconds = todo.reminder?.delayMinutes
      ? todo.reminder.delayMinutes * 60
      : 0;

    if (
      (isEntering && todo.reminder?.reminderOnArrival) ||
      (!isEntering && todo.reminder && !todo.reminder.reminderOnArrival)
    ) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: appName,
          subtitle: isEntering
            ? `${location.alias}에 도착했어요`
            : `${location.alias}에서 출발했어요`,
          body: `${todo.title} 잊지마세요!`,
        },
        trigger: {
          seconds: delaySeconds > 0 ? delaySeconds : 1,
        },
      });
    }
  } catch (error) {
    console.error('Error sending location notification:', error);
  }
};

const startGeofencing = async (userId) => {
  try {
    console.log('Starting geofencing for user:', userId);
    const locationsWithTodos = await getLocationsWithTodos(userId);
    console.log('locationsWithTodos', locationsWithTodos);

    const geofences = Object.values(locationsWithTodos)
      .flatMap((location) =>
        Object.values(location.todos || {})
          .filter((todo) => todo.reminder && todo.reminder.isEnabled)
          .map((todo) => {
            if (!location.latitude || !location.longitude) {
              console.log(`Invalid coordinates for location ${location.id}`);
              return null;
            }
            return {
              identifier: `${location.id}|${todo.id}|${userId}`,
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 300,
              notifyOnEnter: todo.reminder.reminderOnArrival,
              notifyOnExit: !todo.reminder.reminderOnArrival,
            };
          }),
      )
      .filter(Boolean);

    if (geofences.length === 0) {
      console.log('No valid geofences to set up');
      return;
    }

    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, geofences);
    console.log('Geofencing started with', geofences.length, 'locations');
  } catch (error) {
    console.error('Error starting geofencing:', error);
  }
};

const setupGeofencing = async (userId) => {
  try {
    console.log('Setting up geofencing for user:', userId);
    await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME).catch((error) => {
      console.log(
        'Failed to stop geofencing, it may not have been running:',
        error,
      );
    });
    await startGeofencing(userId);
  } catch (error) {
    console.error('Error setting up geofencing:', error);
  }
};

export { setupGeofencing };
