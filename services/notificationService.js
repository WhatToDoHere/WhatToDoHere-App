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

    const [locationId, userId] = region.identifier.split('|');
    if (!userId) {
      console.error('userId not found in region identifier');
      return;
    }

    await handleLocationEvent(locationId, userId, eventType);
  },
);

const lastNotificationTimes = {};
const DEBOUNCE_INTERVAL = 60000;

const handleLocationEvent = async (locationId, userId, eventType) => {
  const now = Date.now();
  const lastTime = lastNotificationTimes[locationId] || 0;

  console.log(`Checking notifications for location ${locationId}:`);
  console.log(`Last notification time: ${new Date(lastTime).toISOString()}`);
  console.log(`Current time: ${new Date(now).toISOString()}`);
  console.log(`Time difference: ${now - lastTime}ms`);

  if (now - lastTime < DEBOUNCE_INTERVAL) {
    console.log(`Notifications debounced for location ${locationId}`);
    return;
  }

  lastNotificationTimes[locationId] = now;

  try {
    const locations = await getLocationsWithTodos(userId);
    const location = locations[locationId];

    if (!location || !location.todos) {
      console.error('Location or todos not found');
      return;
    }

    const isEntering = eventType === Location.GeofencingEventType.Enter;

    Object.entries(location.todos).forEach(([todoId, todo]) => {
      if (todo.reminder && todo.reminder.isEnabled && !todo.completed) {
        sendLocationNotification(location, todo, userId, isEntering);
      }
    });
  } catch (error) {
    console.error('Error handling location event:', error);
  }
};

const sendLocationNotification = async (location, todo, userId, isEntering) => {
  console.log(
    `Sending notification for todo ${todo.id} at location ${location.id}`,
  );

  const appName = 'WhatToDoHere';
  const notificationId = `${location.id}_${todo.id}_${isEntering ? 'enter' : 'exit'}`;

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
        sound: true,
        vibrate: [0, 250, 250, 250],
      },
      trigger: {
        seconds: delaySeconds > 0 ? delaySeconds : 1,
      },
    });
  }
};

const startGeofencing = async (userId) => {
  try {
    console.log('Starting geofencing for user:', userId);
    const locationsWithTodos = await getLocationsWithTodos(userId);
    console.log('locationsWithTodos', locationsWithTodos);

    const geofences = Object.values(locationsWithTodos)
      .filter((location) => {
        return Object.values(location.todos || {}).some(
          (todo) => todo.reminder && todo.reminder.isEnabled && !todo.completed,
        );
      })
      .map((location) => {
        if (!location.latitude || !location.longitude) {
          console.log(`Invalid coordinates for location ${location.id}`);
          return null;
        }
        return {
          identifier: `${location.id}|${userId}`,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 300,
          notifyOnEnter: true,
          notifyOnExit: true,
        };
      })
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
