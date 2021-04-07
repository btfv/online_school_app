import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import homeworkListReducer from './homeworkListReducer';
import homeworkReducer from './homeworkReducer';
import solutionReducer from './solutionReducer';
import receivedStudentsReducer from './receivedStudentsReducer';
import addHomeworkReducer from './addHomeworkReducer';
import studentProfileReducer from './studentProfileReducer';
import profileReducer from './profileReducer';
import receivedTeachersReducer from './receivedTeachersReducer';

const rootReducer = (history) =>
	combineReducers({
		form: formReducer,
		router: connectRouter(history),
		authReducer,
		homeworkListReducer,
		homeworkReducer,
		solutionReducer,
		receivedStudentsReducer,
		addHomeworkReducer,
		studentProfileReducer,
		profileReducer,
		receivedTeachersReducer,
	});
export default rootReducer;
