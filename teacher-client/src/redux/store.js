import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers/rootReducer';
export const history = createBrowserHistory();

export const initialState = {
	authReducer: {
		loggedIn: false,
		loggingIn: false,
		user: null,
		changingPassword: false,
		registering: false,
	},
	homeworkListReducer: {
		homeworkPreviews: [],
		loadedHomeworkPreviews: false,
		loadingHomeworkPreviews: false,
	},
	homeworkReducer: {
		gettingHomework: false,
		sendingSolution: false,
	},
	solutionReducer: {
		loadingSolution: false,
		loadedSolution: false,
	},
	receivedStudentsReducer: {
		loadingStudents: false,
		loadedStudents: false,
		receivedStudents: [],
		searchingStudents: false,
		searchedStudents: false,
		searchedStudentsList: [],
	},
	receivedTeachersReducer: {
		loadingTeachers: false,
		loadedTeachers: false,
		receivedTeachers: [],
		searchingTeachers: false,
		searchedTeachers: false,
		searchedTeachersList: [],
	},
	addHomeworkReducer: {
		addedHomework: false,
		addHomework: false,
	},
	studentProfileReducer: {
		loadingProfile: false,
		loadedProfile: false,
	},
	profileReducer: {
		loadingProfile: false,
		loadedProfile: false,
		uploadingPicture: false,
		uploadedPicture: false,
	},
};

const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(
	rootReducer(history),
	initialState,
	composeWithDevTools(composedEnhancers)
);

export default store;
