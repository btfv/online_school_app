import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import homeworkListReducer from './homeworkListReducer';
import homeworkReducer from './homeworkReducer';
import solutionListReducer from './solutionListReducer';
import solutionReducer from './solutionReducer';
import studentListReducer from './studentListReducer';
import addHomeworkReducer from './addHomeworkReducer';
import studentProfileReducer from './studentProfileReducer';

const rootReducer = (history) =>
	combineReducers({
		form: formReducer,
		router: connectRouter(history),
		authReducer,
		homeworkListReducer,
		homeworkReducer,
		solutionListReducer,
		solutionReducer,
		studentListReducer,
		addHomeworkReducer,
		studentProfileReducer,
	});
export default rootReducer;
