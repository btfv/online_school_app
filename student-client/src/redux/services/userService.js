import config from '../../config';
import handleResponse from './handleResponse';
import { handleLoginResponse } from './handleResponse';
export const userService = {
	login,
	logout,
	changePassword,
};

function login(value) {
	const username = value.username;
	const password = value.password;
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({ username, password }),
	};
	return fetch(config.API_URL + '/api/login', requestOptions)
		.then(handleLoginResponse)
		.then((user) => {
			localStorage.setItem('user', JSON.stringify(user));
			return user;
		});
}

function logout() {
	localStorage.removeItem('user');
	document.location.reload(true);
}

function changePassword(value) {
	const { oldPassword, newPassword } = value;
	const reqBody = JSON.stringify({ oldPassword, newPassword });
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: reqBody,
	};
	const reqUrl = config.API_URL + '/api/student/changePassword';
	return fetch(reqUrl, requestOptions).then(handleResponse);
}
