import { userConstants } from '../constants';
import { userService } from '../services/userService';
import { history } from '../store';

export const userActions = {
	login,
	logout,
};

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

	function request(user) {
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
	return { type: userConstants.LOGOUT };
}
