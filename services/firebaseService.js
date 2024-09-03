import * as ImageManipulator from 'expo-image-manipulator';
import { auth, firestore, storage } from '../firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  arrayUnion,
  serverTimestamp,
  where,
  query,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { setupGeofencing } from './notificationService';

export const saveUserToFirestore = async (user) => {
  try {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData;
    let newLocations = [];

    if (!userDoc.exists()) {
      userData = {
        name: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL,
        friends: [],
        locations: [],
        uid: user.uid,
      };

      await setDoc(userDocRef, userData);

      const locations = [
        {
          alias: 'Home🏡',
          latitude: null,
          longitude: null,
          address: null,
          isWifiEnabled: false,
          ssid: null,
          bssid: null,
          privacy: 'private',
          userId: user.uid,
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
          userId: user.uid,
        },
      ];

      const locationPromises = locations.map(async (location) => {
        return await addDoc(collection(firestore, 'locations'), location);
      });
      const locationRefs = await Promise.all(locationPromises);

      const locationIds = locationRefs.map((ref) => ref.id);
      await updateDoc(userDocRef, { locations: locationIds });

      userData.locations = locationIds;

      newLocations = locationRefs.map((ref, index) => ({
        id: ref.id,
        ...locations[index],
      }));

      console.log('사용자 정보 저장 완료');
    } else {
      userData = userDoc.data();
      console.log('이미 존재하는 사용자');
    }

    return { userData, newLocations };
  } catch (error) {
    console.error('사용자 정보 저장 실패', error);
    throw error;
  }
};

export async function updateUsername(uid, username, lowercaseUsername) {
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    username: username,
    lowercaseUsername: lowercaseUsername,
  });
}

export const checkUsernameExists = async (username) => {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const getLocationsByUserId = async (userId) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const locationIds = userData.locations || [];
      const locations = [];

      for (const id of locationIds) {
        const locationDoc = await getDoc(doc(firestore, 'locations', id));

        if (locationDoc.exists()) {
          const locationData = locationDoc.data();

          const todosCollectionRef = collection(
            firestore,
            'locations',
            id,
            'todos',
          );
          const todosSnapshot = await getDocs(todosCollectionRef);
          const todos = todosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          locations.push({
            id: locationDoc.id,
            ...locationData,
            todos: todos,
          });
        }
      }

      return locations;
    } else {
      throw new Error('사용자 정보가 존재하지 않습니다.');
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const getInitialLocations = async (locationIds) => {
  try {
    if (!locationIds || locationIds.length === 0) {
      return [];
    }

    const userLocations = await Promise.all(
      locationIds.map(async (locationId) => {
        const locationDoc = await getDoc(
          doc(firestore, 'locations', locationId),
        );
        if (locationDoc.exists()) {
          return { id: locationDoc.id, ...locationDoc.data() };
        }
        return null;
      }),
    );

    return userLocations.filter((location) => location !== null);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export const addLocation = async (userId, locationData) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const newLocationId = doc(collection(firestore, 'locations')).id;
    const newLocationData = { id: newLocationId, ...locationData };

    await setDoc(doc(firestore, 'locations', newLocationId), newLocationData);
    await updateDoc(userDocRef, {
      locations: arrayUnion(newLocationId),
    });

    return newLocationData;
  } catch (error) {
    console.error('위치 추가 중 오류 발생:', error);
    throw error;
  }
};

export const updateLocation = async (locationId, locationData) => {
  try {
    const locationDocRef = doc(firestore, 'locations', locationId);

    const locationDoc = await getDoc(locationDocRef);
    if (!locationDoc.exists()) {
      throw new Error('Location not found');
    }
    const existingData = locationDoc.data();

    const updatedData = {
      ...existingData,
      ...locationData,
      todos: existingData.todos || [],
    };

    await updateDoc(locationDocRef, updatedData);

    const todosCollectionRef = collection(locationDocRef, 'todos');
    const todosSnapshot = await getDocs(todosCollectionRef);
    const todos = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      id: locationId,
      ...updatedData,
      todos: todos,
    };
  } catch (error) {
    console.error('위치 수정 중 오류 발생:', error);
    throw error;
  }
};

export const deleteLocation = async (userId, locationId) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const locationDocRef = doc(firestore, 'locations', locationId);

    await deleteDoc(locationDocRef);
    await updateDoc(userDocRef, {
      locations: arrayRemove(locationId),
    });

    return locationId;
  } catch (error) {
    console.error('위치 삭제 중 오류 발생:', error);
    throw error;
  }
};

const compressImage = async (uri) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG },
  );

  return result.uri;
};

export const uploadImage = async (uri) => {
  try {
    const compressedUri = await compressImage(uri);
    const response = await fetch(compressedUri);
    const blob = await response.blob();
    const filename = compressedUri.substring(
      compressedUri.lastIndexOf('/') + 1,
    );
    const storageRef = ref(storage, `todo_images/${filename}`);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getTodo = async (locationId, todoId) => {
  try {
    const todoRef = doc(firestore, 'locations', locationId, 'todos', todoId);
    const todoDoc = await getDoc(todoRef);

    if (todoDoc.exists()) {
      const data = todoDoc.data();
      return {
        id: todoDoc.id,
        ...data,
        reminder: data.reminder || {
          isEnabled: false,
          reminderOnArrival: true,
          delayMinutes: 0,
        },
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting todo:', error);
    throw error;
  }
};

export const getTodosByLocationId = async (locationId) => {
  try {
    const todosCollectionRef = collection(
      firestore,
      'locations',
      locationId,
      'todos',
    );
    const todosDocs = await getDocs(todosCollectionRef);

    return todosDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
};

export const addTodo = async (locationId, todoData) => {
  try {
    const locationRef = doc(firestore, 'locations', locationId);
    const todosCollectionRef = collection(locationRef, 'todos');
    const userId = auth.currentUser?.uid;

    const newTodoRef = await addDoc(todosCollectionRef, {
      ...todoData,
      completed: false,
      createdAt: serverTimestamp(),
    });

    const newTodoId = newTodoRef.id;
    const newTodo = { id: newTodoId, ...todoData, completed: false };

    await setupGeofencing(userId);

    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (locationId, todoId, todoData) => {
  try {
    const userId = auth.currentUser?.uid;
    const todoRef = doc(firestore, 'locations', locationId, 'todos', todoId);

    await updateDoc(todoRef, todoData);
    await setupGeofencing(userId);

    return { id: todoId, ...todoData };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (locationId, todoId) => {
  try {
    const userId = auth.currentUser?.uid;
    const todoRef = doc(firestore, 'locations', locationId, 'todos', todoId);

    await deleteDoc(todoRef);
    await setupGeofencing(userId);

    return todoId;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const searchUsersByUsername = async (username) => {
  const usersRef = collection(firestore, 'users');
  const caseSensitiveQuery = query(
    usersRef,
    where('username', '>=', username),
    where('username', '<=', username + '\uf8ff'),
  );
  const caseSensitiveSnapshot = await getDocs(caseSensitiveQuery);

  const lowercaseUsername = username.toLowerCase();
  const caseInsensitiveQuery = query(
    usersRef,
    where('lowercaseUsername', '>=', lowercaseUsername),
    where('lowercaseUsername', '<=', lowercaseUsername + '\uf8ff'),
  );
  const caseInsensitiveSnapshot = await getDocs(caseInsensitiveQuery);

  const uniqueResults = new Map();

  caseSensitiveSnapshot.docs.forEach((doc) => {
    uniqueResults.set(doc.id, { id: doc.id, ...doc.data() });
  });

  caseInsensitiveSnapshot.docs.forEach((doc) => {
    if (!uniqueResults.has(doc.id)) {
      uniqueResults.set(doc.id, { id: doc.id, ...doc.data() });
    }
  });

  return Array.from(uniqueResults.values());
};

export const addFriend = async (userId, friendId) => {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, {
    friends: arrayUnion(friendId),
  });

  const updatedUserDoc = await getDoc(userRef);
  return updatedUserDoc.data();
};

export const getFriendsList = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const friendIds = userData.friends || [];

      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          const friendDoc = await getDoc(doc(firestore, 'users', friendId));
          if (friendDoc.exists()) {
            return { id: friendDoc.id, ...friendDoc.data() };
          }
          return null;
        }),
      );

      return friendsData.filter((friend) => friend !== null);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching friends list:', error);
    throw error;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      throw new Error('User information does not exist.');
    }
  } catch (error) {
    console.error('Error fetching User info:', error);
    throw error;
  }
};

export const deleteUserData = async (userId) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const batch = writeBatch(firestore);

    const userImageUrls = new Set();
    for (const locationId of userData.locations) {
      const locationRef = doc(firestore, 'locations', locationId);

      const todosCollectionRef = collection(locationRef, 'todos');
      const todosSnapshot = await getDocs(todosCollectionRef);
      todosSnapshot.forEach((todoDoc) => {
        const todoData = todoDoc.data();
        if (todoData.image) {
          userImageUrls.add(todoData.image);
        }
        batch.delete(todoDoc.ref);
      });

      batch.delete(locationRef);
    }

    for (const friendId of userData.friends) {
      const friendRef = doc(firestore, 'users', friendId);
      batch.update(friendRef, {
        friends: arrayRemove(userId),
      });
    }

    batch.delete(userDocRef);

    await batch.commit();

    const deleteImagePromises = Array.from(userImageUrls).map(
      async (imageUrl) => {
        const imagePath = decodeURIComponent(
          imageUrl.split('/o/')[1].split('?')[0],
        );
        const imageRef = ref(storage, imagePath);

        try {
          await deleteObject(imageRef);
          console.log(`Deleted image: ${imagePath}`);
        } catch (error) {
          console.error(`Error deleting image ${imagePath}:`, error);
        }
      },
    );

    await Promise.all(deleteImagePromises);

    console.log('User and related data deleted successfully');
  } catch (error) {
    console.error('Error deleting user and related data:', error);
    throw error;
  }
};
