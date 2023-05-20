export const loadUser = (user) => ({
  type: 'LOAD',
  payload: user,
});

export const updateUser = (data) => ({
  type: 'UPDATE',
  payload: data,
});

export const userSignOut = () => ({
  type: 'SIGN_OUT',
});
