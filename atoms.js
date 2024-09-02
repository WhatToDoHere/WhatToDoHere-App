import { atom } from 'jotai';

export const isGuestAtom = atom(false);
export const userInfoAtom = atom(null);
export const loadingAtom = atom(false);
export const currentLocationAtom = atom(null);
export const selectedLocationAtom = atom(null);
export const locationsAtom = atom([]);
export const todoAtom = atom({
  title: '',
  memo: '',
  image: null,
  reminder: {
    isEnabled: true,
    reminderOnArrival: true,
    delayMinutes: 0,
  },
  locationId: null,
  assignedBy: null,
});
export const currentFriendLocationsAtom = atom([]);
