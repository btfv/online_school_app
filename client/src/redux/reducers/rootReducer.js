import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import homeworkListReducer from './homeworkListReducer';
import homeworkReducer from './homeworkReducer';
const rootReducer = (history) =>
	combineReducers({
		form: formReducer,
		homeworkForm: formReducer,
		router: connectRouter(history),
		authReducer,
		homeworkListReducer,
		homeworkReducer,
	});
export default rootReducer;
