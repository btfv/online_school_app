import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import rootReducer from './reducers/rootReducer.js';
import initialState from './initialState'
export const history = createBrowserHistory();

const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = typeof window !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__ : null;

	if (typeof devToolsExtension === 'function') {
		enhancers.push(devToolsExtension());
	}
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(
	connectRouter(history)(rootReducer),
	initialState,
	composedEnhancers
);

export default store;
