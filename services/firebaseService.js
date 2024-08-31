import * as ImageManipulator from 'expo-image-manipulator';
import { firestore, storage } from '../firebaseConfig';
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
  startAt,
  endAt,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

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

export const getUserLocationCount = async (userId) => {
  const userDocRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();

    return userData.locations ? userData.locations.length : 0;
  } else {
    return 0;
  }
};

export const addLocation = async (userId, locationData, updateLocations) => {
  const userDocRef = doc(firestore, 'users', userId);

  const newLocationId = doc(collection(firestore, 'locations')).id;
  await setDoc(doc(firestore, 'locations', newLocationId), locationData);
  await updateDoc(userDocRef, {
    locations: arrayUnion(newLocationId),
  });

  updateLocations((prevLocations) => [
    ...prevLocations,
    { id: newLocationId, ...locationData },
  ]);
};

export const updateLocation = async (
  locationId,
  locationData,
  updateLocations,
) => {
  const locationDocRef = doc(firestore, 'locations', locationId);
  await updateDoc(locationDocRef, locationData);

  updateLocations((prevLocations) =>
    prevLocations.map((location) =>
      location.id === locationId ? { ...location, ...locationData } : location,
    ),
  );
};

export const addTodo = async (locationId, todoData, updateLocations) => {
  try {
    const locationRef = doc(firestore, 'locations', locationId);
    const todosCollectionRef = collection(locationRef, 'todos');

    const newTodoRef = await addDoc(todosCollectionRef, {
      ...todoData,
      completed: false,
      createdAt: serverTimestamp(),
    });

    const newTodoId = newTodoRef.id;

    updateLocations((prevLocations) => {
      return prevLocations.map((location) => {
        if (location.id === locationId) {
          return {
            ...location,
            todos: [
              ...(location.todos || []),
              { id: newTodoId, ...todoData, completed: false },
            ],
          };
        }
        return location;
      });
    });

    return newTodoId;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (
  locationId,
  todoId,
  todoData,
  updateLocations,
) => {
  try {
    const todoRef = doc(firestore, 'locations', locationId, 'todos', todoId);
    await updateDoc(todoRef, todoData);

    updateLocations((prevLocations) => {
      return prevLocations.map((location) => {
        if (location.id === locationId) {
          return {
            ...location,
            todos: location.todos.map((todo) => {
              if (todo.id === todoId) {
                return { ...todo, ...todoData };
              }
              return todo;
            }),
          };
        }
        return location;
      });
    });
  } catch (error) {
    console.error('Error updating todo:', error);
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

export const deleteTodo = async (locationId, todoId, updateLocations) => {
  try {
    const todoRef = doc(firestore, 'locations', locationId, 'todos', todoId);
    await deleteDoc(todoRef);

    updateLocations((prevLocations) => {
      return prevLocations.map((location) => {
        if (location.id === locationId) {
          return {
            ...location,
            todos: location.todos.filter((todo) => todo.id !== todoId),
          };
        }
        return location;
      });
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const getLocationsWithTodos = async (userId) => {
  try {
    console.log('Getting locations for user:', userId);
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

      const locationsWithTodos = {};

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

          const todos = {};
          todosSnapshot.forEach((todoDoc) => {
            const todoData = todoDoc.data();
            if (todoData.reminder && todoData.reminder.isEnabled) {
              todos[todoDoc.id] = {
                id: todoDoc.id,
                title: todoData.title,
                memo: todoData.memo,
                image: todoData.image,
                completed: todoData.completed,
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

          if (Object.keys(todos).length > 0) {
            locationsWithTodos[locationId] = {
              id: locationId,
              alias: locationData.alias,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              address: locationData.address,
              privacy: locationData.privacy,
              ssid: locationData.ssid,
              bssid: locationData.bssid,
              userId: locationData.userId,
              todos: todos,
            };
          }
        } else {
          console.log(`Location document not found for ID: ${locationId}`);
        }
      }

      console.log('Locations with todos:', locationsWithTodos);
      return locationsWithTodos;
    } else {
      console.log('User document does not exist');
      return {};
    }
  } catch (error) {
    console.error('Error fetching locations with todos:', error);
    return {};
  }
};

export const searchUsersByUsername = async (username) => {
  const usersRef = collection(firestore, 'users');
  // const exactMatchQuery = query(usersRef, where('email', '==', email));
  // const exactMatchSnapshot = await getDocs(exactMatchQuery);

  // const lowerEmail = email.toLowerCase();
  // const prefixMatchQuery = query(
  //   usersRef,
  //   where('email', '>=', lowerEmail),
  //   where('email', '<=', lowerEmail + '\uf8ff'),
  // );
  // const prefixMatchSnapshot = await getDocs(prefixMatchQuery);

  // const results = new Set([
  //   ...exactMatchSnapshot.docs,
  //   ...prefixMatchSnapshot.docs,
  // ]);
  // 대소문자 구분 검색
  const caseSensitiveQuery = query(
    usersRef,
    where('username', '>=', username),
    where('username', '<=', username + '\uf8ff'),
  );
  const caseSensitiveSnapshot = await getDocs(caseSensitiveQuery);

  // 대소문자 구분 없는 검색
  const lowercaseUsername = username.toLowerCase();
  const caseInsensitiveQuery = query(
    usersRef,
    where('lowercaseUsername', '>=', lowercaseUsername),
    where('lowercaseUsername', '<=', lowercaseUsername + '\uf8ff'),
  );
  const caseInsensitiveSnapshot = await getDocs(caseInsensitiveQuery);

  // 결과 합치기 및 중복 제거
  const uniqueResults = new Map();

  caseSensitiveSnapshot.docs.forEach((doc) => {
    uniqueResults.set(doc.id, { id: doc.id, ...doc.data() });
  });

  caseInsensitiveSnapshot.docs.forEach((doc) => {
    if (!uniqueResults.has(doc.id)) {
      uniqueResults.set(doc.id, { id: doc.id, ...doc.data() });
    }
  });

  // Map을 배열로 변환
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

export const deleteLocation = async (userId, locationId, updateLocations) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const locationDocRef = doc(firestore, 'locations', locationId);

    const todosCollectionRef = collection(locationDocRef, 'todos');
    const todosSnapshot = await getDocs(todosCollectionRef);
    const deleteTodoPromises = todosSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref),
    );
    await Promise.all(deleteTodoPromises);

    await deleteDoc(locationDocRef);

    await updateDoc(userDocRef, {
      locations: arrayRemove(locationId),
    });

    updateLocations((prevLocations) =>
      prevLocations.filter((location) => location.id !== locationId),
    );

    console.log('위치 삭제 성공');
  } catch (error) {
    console.error('위치 삭제 중 오류:', error);
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
