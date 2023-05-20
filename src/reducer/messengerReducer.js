const initialState = { show: {}, hide: {} };

const messengerReducer = (state = initialState, action) => {
  const messKey = action.payload;

  switch (action.type) {
    case 'ADD':
      delete state.show[messKey];
      delete state.hide[messKey];

      return { ...state, show: { [messKey]: 'SHOW', ...state.show } };

    case 'MINIMIZE':
      delete state.show[messKey];
      delete state.hide[messKey];

      return { ...state, hide: { [messKey]: 'HIDE', ...state.hide } };

    case 'REMOVE':
      delete state.show[messKey];
      delete state.hide[messKey];

      return { ...state };

    default:
      return state;
  }
};

export default messengerReducer;
