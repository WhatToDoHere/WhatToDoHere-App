import { atom } from 'jotai';

export const userInfoAtom = atom(null);
export const currentLocationAtom = atom(null);
export const selectedLocationAtom = atom(null);
export const wifiSSIDAtom = atom('');
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
