import config from '../../config';
import handleResponse from './handleResponse';

export const studentProfileService = {
	getProfile,
};

function getProfile(studentPublicId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	const reqUrl =
		config.API_URL +
		'/api/getUserInfo/' +
		studentPublicId +
		'?isTeacher=false';
	return fetch(reqUrl, requestOptions).then(handleResponse);
}
