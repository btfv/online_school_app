import config from '../../config';
import handleResponse from './handleResponse';

export const receivedStudentsService = {
	getStudentsByName,
	addStudentToHomework,
	getReceivedStudents,
};
function getReceivedStudents(homeworkPublicId, offset) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL +
			'/api/getReceivedStudents?' +
			'offset=' +
			offset +
			'&homeworkPublicId=' +
			homeworkPublicId,
		requestOptions
	).then(handleResponse);
}
function getStudentsByName(name) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL + '/api/getStudentList?' + 'name=' + name,
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
		config.API_URL + '/api/sendHomework',
		requestOptions
	).then(handleResponse);
}
