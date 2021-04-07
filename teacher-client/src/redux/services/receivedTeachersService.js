import config from '../../config';
import handleResponse from './handleResponse';

export const receivedTeachersService = {
	getTeachersByName,
	addTeacherToHomework,
	getReceivedTeachers,
};
function getReceivedTeachers(homeworkPublicId, offset) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL +
			'/api/getTeachersWithAccess?' +
			'offset=' +
			offset +
			'&homeworkPublicId=' +
			homeworkPublicId,
		requestOptions
	).then(handleResponse);
}
function getTeachersByName(name) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL + '/api/getTeacherList?' + 'name=' + name,
		requestOptions
	).then(handleResponse);
}

function addTeacherToHomework(homeworkPublicId, teacherPublicId) {
	let requestBody = { homeworkPublicId, teacherPublicId };
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
		config.API_URL + '/api/sendHomeworkToTeacher',
		requestOptions
	).then(handleResponse);
}
