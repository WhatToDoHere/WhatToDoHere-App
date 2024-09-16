import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

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

const getLocationsWithActiveReminders = async (userId) => {
  try {
    console.log('Getting locations with active reminders for user:', userId);
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const locationIds = userData.locations || [];
      console.log('Location IDs:', locationIds);

      if (!Array.isArray(locationIds)) {
        console.error('locationIds is not an array:', locationIds);
        return {};
      }

      const locationsWithActiveReminders = {};

      for (const locationId of locationIds) {
        if (typeof locationId !== 'string') {
          console.error('Invalid locationId:', locationId);
          continue;
        }

        const locationDoc = await getDoc(
          doc(firestore, 'locations', locationId),
        );

        if (locationDoc.exists()) {
          const locationData = locationDoc.data();

          const todosCollectionRef = collection(
            firestore,
            'locations',
            locationId,
            'todos',
          );
          const todosSnapshot = await getDocs(todosCollectionRef);

          const activeTodos = {};
          todosSnapshot.forEach((todoDoc) => {
            const todoData = todoDoc.data();
            if (
              todoData.reminder &&
              todoData.reminder.isEnabled &&
              !todoData.completed
            ) {
              activeTodos[todoDoc.id] = {
                id: todoDoc.id,
                title: todoData.title,
                memo: todoData.memo,
                image: todoData.image,
                assignedBy: todoData.assignedBy,
                createdAt: todoData.createdAt,
                locationId: todoData.locationId,
                reminder: {
                  isEnabled: todoData.reminder.isEnabled,
                  reminderOnArrival: todoData.reminder.reminderOnArrival,
                  delayMinutes: todoData.reminder.delayMinutes || 0,
                },
              };
            }
          });

          if (Object.keys(activeTodos).length > 0) {
            locationsWithActiveReminders[locationId] = {
              id: locationId,
              alias: locationData.alias,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              address: locationData.address,
              privacy: locationData.privacy,
              ssid: locationData.ssid,
              bssid: locationData.bssid,
              userId: locationData.userId,
              activeTodos: activeTodos,
            };
          }
        } else {
          console.log(`Location document not found for ID: ${locationId}`);
        }
      }

      return locationsWithActiveReminders;
    } else {
      console.log('User document does not exist');
      return {};
    }
  } catch (error) {
    console.error('Error fetching locations with active reminders:', error);
    return {};
  }
};

const handleLocationEvent = async (locationId, userId, eventType) => {
  const now = Date.now();
  const lastTime = lastNotificationTimes[locationId] || 0;

  if (now - lastTime < DEBOUNCE_INTERVAL) {
    console.log(`Notifications debounced for location ${locationId}`);
    return;
  }

  lastNotificationTimes[locationId] = now;

  try {
    const locations = await getLocationsWithActiveReminders(userId);
    const location = locations[locationId];

    if (!location || !location.todos) {
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
    const locationsWithReminder = await getLocationsWithActiveReminders(userId);
    console.log('Locations with active reminders:', locationsWithReminder);

    const geofences = Object.values(locationsWithReminder)
      .map((location) => {
        if (!location.latitude || !location.longitude) {
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
    const { status: backgroundStatus } =
      await Location.getBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      return;
    }

    const { status: notificationStatus } =
      await Notifications.getPermissionsAsync();
    if (notificationStatus !== 'granted') {
      return;
    }

    const isGeofencingRegistered =
      await TaskManager.isTaskRegisteredAsync(GEOFENCING_TASK_NAME);

    if (isGeofencingRegistered) {
      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
    }

    await startGeofencing(userId);
  } catch (error) {
    console.error('Error setting up geofencing:', error);
  }
};

const stopGeofencing = async () => {
  try {
    await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
  } catch (error) {
    console.error('Error stopping geofencing:', error);
  }
};

export { setupGeofencing, stopGeofencing };
