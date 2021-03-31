import config from '../../config';
import handleResponse, { handleLoginResponse } from './handleResponse';

export const userService = {
	login,
	logout,
	changePassword,
	register,
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
	return fetch(config.API_URL + '/auth/teacherLogin', requestOptions)
		.then(handleLoginResponse)
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
	const reqUrl = config.API_URL + '/auth/changePassword';
	return fetch(reqUrl, requestOptions).then(handleResponse);
}

function register(value) {
	const { firstname, lastname, username, email, password } = value;
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({ firstname, lastname, username, email, password }),
	};
	return fetch(config.API_URL + '/api/teacher/register', requestOptions).then(
		handleResponse
	);
}

function logout() {
	localStorage.removeItem('user');
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	let reqUrl =
		'/auth/logout';
	fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
	window.location.reload();
}
