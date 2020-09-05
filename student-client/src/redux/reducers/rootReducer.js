import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import homeworkListReducer from './homeworkListReducer';
import homeworkReducer from './homeworkReducer';
import solutionListReducer from './solutionListReducer';
import solutionReducer from './solutionReducer';
const rootReducer = (history) =>
	combineReducers({
		form: formReducer,
		router: connectRouter(history),
		authReducer,
		homeworkListReducer,
		homeworkReducer,
		solutionListReducer,
		solutionReducer,
	});
export default rootReducer;
