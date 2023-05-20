import { legacy_createStore } from 'redux';
import appReducer from './reducer';

const store = legacy_createStore(appReducer);

export default store;
