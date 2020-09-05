import config from '../../config';
import { userService } from './userService';
import handleResponse from './handleResponse';

export const studentListService = {
	getStudentsByName,
	addStudentToHomework
};
function getStudentsByName(name) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL + '/api/students/getStudentsByName?' + 'name=' + name,
		requestOptions
	).then(handleResponse);
}

function addStudentToHomework(homeworkPublicId, studentPublicId) {
	let requestBody = { homeworkPublicId, studentPublicId };
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify(requestBody),
	};
	return fetch(
		config.API_URL + '/api/homeworks/addStudent',
		requestOptions
	).then(handleResponse);
}
