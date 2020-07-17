import config from '../config';

export const userService = {
	login,
	logout,
};

function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401 || response.status === 400) {
				// auto logout if 401 response returned from api
				logout();
				document.location.reload(true);
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}

function login(username, password) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Origin: 'http://localhost:3000',
		},
		body: JSON.stringify({ username, password }),
		mode: 'cors',
	};
	return fetch(config.API_URL + '/api/login', requestOptions)
		.then(handleResponse)
		.then((user) => {
			// store user details in local storage to keep user logged in between page refreshes
			localStorage.setItem('user', JSON.stringify(user));
			return user;
		});
}

function logout() {
	// remove user from local storage to log user out
	localStorage.removeItem('user');
}
