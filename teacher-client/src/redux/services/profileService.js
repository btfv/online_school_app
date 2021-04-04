import config from '../../config';
import handleResponse from './handleResponse';

export const profileService = {
	uploadProfilePicture,
	getProfile,
};

function uploadProfilePicture(value) {
	const reqBody = new FormData();
	reqBody.append('picture', value.picture[0]);
	const requestOptions = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		'Content-Type': 'multipart/form-data',
		body: reqBody,
	};
	return fetch(config.API_URL + '/api/uploadProfilePic', requestOptions).then(
		handleResponse
	);
}

function getProfile() {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(config.API_URL + '/api/getProfile', requestOptions).then(
		handleResponse
	);
}
