import { userConstants } from '../constants';
import { userService } from '../services/userService';
import { history } from '../store';
export const userActions = {
	login,
	logout,
	clearError,
	changePassword,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: userConstants.CLEAR_ERROR });
	};
}

function login(value) {
	return (dispatch) => {
		dispatch(request());
		userService.login(value).then(
			(user) => {
				dispatch(success(user));
				history.push('/dashboard');
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: userConstants.LOGIN_REQUEST };
	}
	function success(user) {
		return { type: userConstants.LOGIN_SUCCESS, user };
	}
	function failure(error) {
		return { type: userConstants.LOGIN_FAILURE, error };
	}
}

function logout() {
	userService.logout();
	return (dispatch) => {
		dispatch({ type: userConstants.LOGOUT });
	};
}

function changePassword(value) {
	return (dispatch) => {
		dispatch(request());
		userService.changePassword(value).then(
			() => {
				dispatch(success());
				userService.logout();
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};

	function request() {
		return { type: userConstants.CHANGE_PASSWORD_REQUEST };
	}
	function success() {
		return { type: userConstants.CHANGE_PASSWORD_SUCCESS };
	}
	function failure(error) {
		return { type: userConstants.CHANGE_PASSWORD_FAILURE, error };
	}
}
