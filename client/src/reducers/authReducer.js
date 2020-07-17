import { userConstants } from '../constants/userConstants';
import initialState from '../initialState'
let user = JSON.parse(localStorage.getItem('user'));
const currentState = user ? { isLoggedIn: true, isLoggingIn: false, user } : initialState;

const authReducer = (state = currentState, action) => {
	switch (action.type) {
		case userConstants.LOGIN_REQUEST:
			return {
				isLoggingIn: true,
				isLoggedIn: false,
				user: {},
			};
		case userConstants.LOGIN_SUCCESS:
			return {
				isLoggingIn: false,
				isLoggedIn: true,
				user: action.user,
			};
		case userConstants.LOGIN_FAILURE:
			return {};
		case userConstants.LOGOUT:
			return {};
		default:
			return state;
	}
};
export default authReducer;
