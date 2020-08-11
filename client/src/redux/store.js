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
	},
	homeworkListReducer: {
		homeworkPreviews: [],
		loadedHomeworkPreviews: false,
	},
	homeworkReducer: {
		gettingHomework: false,
		homework: {},
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
