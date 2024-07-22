import { firestore } from '../firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';

export const saveUserToFirestore = async (user) => {
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
          privacy: '비공개',
          userId: user.uid,
        },
        {
          alias: 'Company',
          latitude: null,
          longitude: null,
          address: '위치를 추가해주세요!',
          privacy: '비공개',
          userId: user.uid,
        },
      ];

      const locationPromises = locations.map(async (location) => {
        return await addDoc(collection(firestore, 'locations'), location);
      });
      const locationRefs = await Promise.all(locationPromises);

      const locationIds = locationRefs.map((ref) => ref.id);
      await updateDoc(userDocRef, { locations: locationIds });

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
    const q = query(
      collection(firestore, 'locations'),
      where('userId', '==', userId),
    );
    const querySnapshot = await getDocs(q);
    const locations = [];

    querySnapshot.forEach((doc) => {
      locations.push({ id: doc.id, ...doc.data() });
    });

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};
