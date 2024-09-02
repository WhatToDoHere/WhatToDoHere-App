import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export const GUEST_USER_KEY = 'guest';
export const GUEST_LOCATIONS_KEY = 'guestLocations';

export const saveGuestUser = async () => {
  try {
    const existingGuestUser = await AsyncStorage.getItem(GUEST_USER_KEY);
    const existingGuestLocations =
      await AsyncStorage.getItem(GUEST_LOCATIONS_KEY);

    if (existingGuestUser && existingGuestLocations) {
      const userData = JSON.parse(existingGuestUser);
      const locations = JSON.parse(existingGuestLocations);

      return { userData, locations };
    } else {
      const locationIds = [Crypto.randomUUID(), Crypto.randomUUID()];

      const userData = {
        uid: GUEST_USER_KEY,
        name: 'Guest',
        username: 'Guest',
        email: null,
        photoURL: null,
        friends: [],
        locations: locationIds,
      };

      const locations = [
        {
          id: locationIds[0],
          alias: 'Home🏡',
          latitude: null,
          longitude: null,
          address: null,
          isWifiEnabled: false,
          ssid: null,
          bssid: null,
          privacy: 'private',
          userId: GUEST_USER_KEY,
          todos: [],
        },
        {
          id: locationIds[1],
          alias: 'Company🏢',
          latitude: null,
          longitude: null,
          address: null,
          isWifiEnabled: false,
          ssid: null,
          bssid: null,
          privacy: 'private',
          userId: GUEST_USER_KEY,
          todos: [],
        },
      ];

      await AsyncStorage.setItem(GUEST_USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(
        GUEST_LOCATIONS_KEY,
        JSON.stringify(locations),
      );

      return { userData, locations };
    }
  } catch (error) {
    console.error('게스트 사용자 생성 및 저장 중 오류 발생:', error);
    throw error;
  }
};

export const getLocations = async () => {
  try {
    const guestLocations = await AsyncStorage.getItem(GUEST_LOCATIONS_KEY);
    return guestLocations != null ? JSON.parse(guestLocations) : [];
  } catch (error) {
    console.error(
      'AsyncStorage에서 게스트 위치 정보를 읽는 중 오류 발생:',
      error,
    );
    return [];
  }
};

export const setLocations = async (locations) => {
  try {
    const jsonValue = JSON.stringify(locations);
    await AsyncStorage.setItem(GUEST_LOCATIONS_KEY, jsonValue);
  } catch (error) {
    console.error(
      'AsyncStorage에 게스트 위치 정보를 저장하는 중 오류 발생:',
      error,
    );
    throw error;
  }
};

export const addLocation = async (locationData) => {
  try {
    const currentLocations = await getLocations();
    const newLocation = {
      ...locationData,
      id: Crypto.randomUUID(),
      userId: GUEST_USER_KEY,
    };
    const updatedLocations = [...currentLocations, newLocation];

    await setLocations(updatedLocations);
    return newLocation;
  } catch (error) {
    console.error(
      'AsyncStorage에 게스트 위치 정보를 추가하는 중 오류 발생:',
      error,
    );
    throw error;
  }
};

export const updateLocation = async (locationId, locationData) => {
  try {
    const locations = await getLocations();
    const locationIndex = locations.findIndex((location) => {
      return location.id === locationId;
    });

    if (locationIndex === -1) {
      throw new Error('Location not found');
    }

    const updatedLocation = {
      ...locations[locationIndex],
      ...locationData,
      id: locationId,
      todos: locations[locationIndex].todos || [],
    };

    locations[locationIndex] = updatedLocation;
    await setLocations(locations);
    return updatedLocation;
  } catch (error) {
    console.error(
      'AsyncStorage에서 게스트 위치 정보를 업데이트하는 중 오류 발생:',
      error,
    );
    throw error;
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const currentLocations = await getLocations();
    const updatedLocations = currentLocations.filter((location) => {
      return location.id !== locationId;
    });

    await setLocations(updatedLocations);
    return locationId;
  } catch (error) {
    console.error(
      'AsyncStorage에서 게스트 위치 정보를 삭제하는 중 오류 발생:',
      error,
    );
    throw error;
  }
};

export const getTodo = async (locationId, todoId) => {
  try {
    const locations = await getLocations();
    const location = locations.find((location) => location.id === locationId);

    if (!location || !Array.isArray(location.todos)) {
      return null;
    }

    const todo = location.todos.find((todo) => todo.id === todoId);

    if (todo) {
      return {
        ...todo,
        reminder: todo.reminder || {
          isEnabled: false,
          reminderOnArrival: true,
          delayMinutes: 0,
        },
      };
    }

    return null;
  } catch (error) {
    console.error('AsyncStorage에서 todo 가져오기 중 오류 발생:', error);
    throw error;
  }
};

export const uploadImage = async (uri) => {
  return uri;
};

export const addTodo = async (locationId, todoData) => {
  try {
    const locations = await getLocations();
    const locationIndex = locations.findIndex((location) => {
      return location.id === locationId;
    });

    if (locationIndex === -1) {
      throw new Error('Location not found');
    }

    const newTodo = {
      id: Crypto.randomUUID(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(locations[locationIndex].todos)) {
      locations[locationIndex].todos = [];
    }

    locations[locationIndex].todos.push(newTodo);

    await setLocations(locations);

    return newTodo;
  } catch (error) {
    console.error('AsyncStorage에 todo 추가 중 오류 발생:', error);
    throw error;
  }
};

export const updateTodo = async (locationId, todoId, todoData) => {
  try {
    const locations = await getLocations();
    const locationIndex = locations.findIndex((location) => {
      return location.id === locationId;
    });

    if (locationIndex === -1) {
      throw new Error('Location not found');
    }

    const todoIndex = locations[locationIndex].todos.findIndex((todo) => {
      return todo.id === todoId;
    });

    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    locations[locationIndex].todos[todoIndex] = {
      ...locations[locationIndex].todos[todoIndex],
      ...todoData,
    };

    await setLocations(locations);
    return { id: todoId, ...todoData };
  } catch (error) {
    console.error('AsyncStorage에서 todo 업데이트 중 오류 발생:', error);
    throw error;
  }
};

export const deleteTodo = async (locationId, todoId) => {
  try {
    const locations = await getLocations();
    const locationIndex = locations.findIndex((location) => {
      return location.id === locationId;
    });

    if (locationIndex === -1) {
      throw new Error('Location not found');
    }

    locations[locationIndex].todos = locations[locationIndex].todos.filter(
      (todo) => todo.id !== todoId,
    );

    await setLocations(locations);
    return todoId;
  } catch (error) {
    console.error('AsyncStorage에서 todo 삭제 중 오류 발생:', error);
    throw error;
  }
};
