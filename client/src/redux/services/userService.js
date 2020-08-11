import config from '../../config';

export const userService = {
	login,
	logout,
};

function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401 || response.status === 400) {
				logout();
				document.location.reload(true);
			}
			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}
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
		.then(handleResponse)
		.then((user) => {
			localStorage.setItem('user', JSON.stringify(user));
			return user;
		});
}

function logout() {
	localStorage.removeItem('user');
}
