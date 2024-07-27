export const TODO_ITEM_HEIGHT = 34;
export const ADD_TODO_ITEM_HEIGHT = 54;
export const REMINDER_TRIGGER = {
  ARRIVE: '도착할 때',
  LEAVE: '떠날 때',
};
export const DEFAULT_TODO_DATA = {
  title: '',
  memo: '',
  image: null,
  reminder: {
    isEnabled: false,
    reminderOnArrival: true,
    delayMinutes: 0,
  },
  locationId: '',
  assignedBy: '',
};
