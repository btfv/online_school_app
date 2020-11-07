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
		homework: {},
		sendingSolution: false,
		firstAttempt: false,
		addedTask: false,
	},
	solutionListReducer: {
		solutionPreviews: [],
		loadedSolutionPreviews: false,
		loadingSolutionPreviews: false,
	},
	solutionReducer: {
		gettingSolution: false,
		solution: {},
		firstAttempt: false,
	},
	studentListReducer: {
		loadingStudents: false,
		loadedStudents: false,
		students: [],
		receivedStudentsOnClient: [],
	},
	addHomeworkReducer: {
		addedHomework: false,
		addHomework: false,
	},
	studentProfileReducer: {
		profile: {},
		loadingProfile: false,
		loadedProfile: false,
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
