import { atom } from 'jotai';
import { REMINDER_TRIGGER } from './constants/todo';

export const userInfoAtom = atom(null);
export const currentLocationAtom = atom(null);
export const selectedLocationAtom = atom(null);
export const wifiSSIDAtom = atom('');
export const locationsAtom = atom([]);
export const todoAtom = atom({
  id: null,
  title: '',
  memo: '',
  image: null,
  reminder: {
    isEnabled: true,
    trigger: REMINDER_TRIGGER.ARRIVE,
    delayMinutes: 0,
  },
  locationId: null,
  assignedBy: null,
});
