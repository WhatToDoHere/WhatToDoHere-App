import '@testing-library/jest-native/extend-expect';

jest.mock('jotai', () => ({
  atom: jest.fn(() => ({ init: null })),
  useAtom: jest.fn(() => [{ uid: 'mockUserId' }, jest.fn()]),
}));

jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openSettings: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('./atoms', () => ({
  userInfoAtom: { init: { uid: 'mockUserId' } },
  currentLocationAtom: { init: null },
  selectedLocationAtom: { init: null },
  locationsAtom: { init: [] },
}));

jest.mock('./services/firebaseService', () => ({
  getUserInfo: jest.fn(),
  updateTodo: jest.fn(),
}));
