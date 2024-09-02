import { firestore } from '../firebaseConfig';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_USER_KEY, GUEST_LOCATIONS_KEY } from './asyncStorageService';

export const migrateAsyncToFirestore = async (user) => {
  try {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const isFirstLogin = !userDoc.exists();

    const asyncLocations = await AsyncStorage.getItem('guestLocations');
    let locations = asyncLocations ? JSON.parse(asyncLocations) : [];

    const processLocation = async (location, isFirstLogin) => {
      const {
        id: oldLocationId,
        todos,
        latitude,
        longitude,
        ...locationData
      } = location;

      const hasLocation = latitude !== null && longitude !== null;
      const hasTodos = todos && todos.length > 0;

      if (!isFirstLogin && !hasLocation && !hasTodos) {
        return null;
      }

      const newLocationRef = await addDoc(collection(firestore, 'locations'), {
        ...locationData,
        latitude,
        longitude,
        userId: user.uid,
      });
      const newLocationId = newLocationRef.id;

      const todosCollectionRef = collection(newLocationRef, 'todos');
      const newTodos = [];
      for (const todo of todos) {
        const { id: oldTodoId, ...todoData } = todo;
        const newTodoRef = await addDoc(todosCollectionRef, {
          ...todoData,
          locationId: newLocationId,
          assignedBy:
            todoData.assignedBy === GUEST_USER_KEY
              ? user.uid
              : todoData.assignedBy,
        });
        newTodos.push({
          id: newTodoRef.id,
          ...todoData,
          locationId: newLocationId,
        });
      }

      return {
        id: newLocationId,
        ...locationData,
        latitude,
        longitude,
        todos: newTodos,
      };
    };

    if (isFirstLogin) {
      if (locations.length === 0) {
        locations = [
          {
            alias: 'Home🏡',
            latitude: null,
            longitude: null,
            address: null,
            isWifiEnabled: false,
            ssid: null,
            bssid: null,
            privacy: 'private',
            todos: [],
          },
          {
            alias: 'Company🏢',
            latitude: null,
            longitude: null,
            address: null,
            isWifiEnabled: false,
            ssid: null,
            bssid: null,
            privacy: 'private',
            todos: [],
          },
        ];
      }

      const processedLocations = await Promise.all(
        locations.map((location) => processLocation(location, true)),
      );
      const newLocations = processedLocations.filter(
        (location) => location !== null,
      );
      const newLocationIds = newLocations.map((loc) => loc.id);

      const userData = {
        name: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL,
        friends: [],
        locations: newLocationIds,
        uid: user.uid,
      };

      await setDoc(userDocRef, userData);

      return { userData, locations: newLocations };
    } else {
      const existingUserData = userDoc.data();
      const processedLocations = await Promise.all(
        locations.map((location) => processLocation(location, false)),
      );
      const newLocations = processedLocations.filter(
        (location) => location !== null,
      );
      const newLocationIds = newLocations.map((loc) => loc.id);
      const updatedLocationIds = [
        ...existingUserData.locations,
        ...newLocationIds,
      ];

      const updatedUserData = {
        ...existingUserData,
        locations: updatedLocationIds,
      };

      await setDoc(userDocRef, updatedUserData);

      return { userData: updatedUserData, locations: newLocations };
    }
  } catch (error) {
    console.error('AsyncStorage to Firestore migration failed:', error);
    throw error;
  } finally {
    await AsyncStorage.removeItem(GUEST_LOCATIONS_KEY);
    await AsyncStorage.removeItem(GUEST_USER_KEY);
  }
};
