import config from '../../config';
import handleResponse from './handleResponse';

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
	return fetch(config.API_URL + '/api/teacher/login', requestOptions)
		.then(handleResponse)
		.then((user) => {
			localStorage.setItem('user', JSON.stringify(user));
			return user;
		});
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
	const reqUrl = config.API_URL + '/api/teacher/changePassword';
	return fetch(reqUrl, requestOptions).then(handleResponse);
}

function logout() {
	localStorage.removeItem('user');
	window.location.reload();
}
