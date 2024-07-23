import { firestore } from '../firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
} from 'firebase/firestore';

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
          alias: 'Home',
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
          alias: 'Company',
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
          locations.push({ id: locationDoc.id, ...locationDoc.data() });
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
