import { userConstants } from '../constants';
import { initialState } from '../store';
let user = localStorage.getItem('user');

export default function authReducer(
	state = (() => {
		if (typeof user !== undefined) {
			return {
				...initialState,
				authReducer: {
					user,
					loggedIn: true,
					loggingIn: false,
				},
			};
		}
	})(),
	action
) {
	switch (action.type) {
		case userConstants.LOGIN_REQUEST:
			return {
				...state,
				loggingIn: true,
			};
		case userConstants.LOGOUT:
			return {
				...state,
				user: null,
			};
		case userConstants.LOGIN_SUCCESS:
			return {
				...state,
				loggedIn: true,
				loggingIn: false,
				user: action.user,
			};
		case userConstants.LOGIN_FAILURE:
			return { ...state, error: action.error, loggingIn: false };

		case userConstants.CHANGE_PASSWORD_REQUEST:
			return { ...state, changingPassword: true };
		case userConstants.CHANGE_PASSWORD_SUCCESS:
			return { ...state, changingPassword: false };
		case userConstants.CHANGE_PASSWORD_FAILURE:
			return { ...state, changingPassword: false, error: action.error };
		case userConstants.CLEAR_ERROR:
			return { ...state, error: null };

		case userConstants.REGISTER_REQUEST:
			return { ...state, registering: true };
		case userConstants.REGISTER_SUCCESS:
			return { ...state, registering: false };
		case userConstants.REGISTER_FAILURE:
			return { ...state, error: action.error };
		default:
			return state;
	}
}
