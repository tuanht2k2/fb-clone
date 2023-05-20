export const addMessgenger = (messengerId) => ({
  type: 'ADD',
  payload: messengerId,
});

export const minimizeMessenger = (messengerId) => ({
  type: 'MINIMIZE',
  payload: messengerId,
});

export const removeMessgenger = (messengerId) => ({
  type: 'REMOVE',
  payload: messengerId,
});
