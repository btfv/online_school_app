import { combineReducers } from 'redux';
import authReducer from './authReducer.js';
export default combineReducers({
    isLoggedIn: authReducer,
    isLoggingIn : authReducer,
    user : authReducer
});
