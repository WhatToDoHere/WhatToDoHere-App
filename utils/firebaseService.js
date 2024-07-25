import * as ImageManipulator from 'expo-image-manipulator';
import { firestore, storage } from '../firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const saveUserToFirestore = async (user, updateLocations) => {
  try {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL,
        friends: [],
        locations: [],
      });

      const locations = [
        {
          alias: 'Home🏡',
          latitude: null,
          longitude: null,
          address: '위치를 추가해주세요!',
          ssid: null,
          alertType: 'arrival',
          privacy: 'private',
          userId: user.uid,
          deleted: false,
        },
        {
          alias: 'Company🏢',
          latitude: null,
          longitude: null,
          address: '위치를 추가해주세요!',
          ssid: null,
          alertType: 'arrival',
          privacy: 'private',
          userId: user.uid,
          deleted: false,
        },
      ];

      const locationPromises = locations.map(async (location) => {
        return await addDoc(collection(firestore, 'locations'), location);
      });
      const locationRefs = await Promise.all(locationPromises);

      const locationIds = locationRefs.map((ref) => ref.id);
      await updateDoc(userDocRef, { locations: locationIds });

      const newLocations = locationRefs.map((ref, index) => ({
        id: ref.id,
        ...locations[index],
      }));

      updateLocations((prevLocations) => [...prevLocations, ...newLocations]);

      console.log('사용자 정보 저장 완료');
    } else {
      console.log('이미 존재하는 사용자');
    }
  } catch (error) {
    console.error('사용자 정보 저장 실패', error);
    throw error;
  }
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
      return { id: todoDoc.id, ...todoDoc.data() };
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
