import config from '../../config';
import handleResponse from './handleResponse'

export const homeworkService = {
	getHomework,
	sendSolution,
};

function getHomework(homeworkPublicId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	let reqUrl =
		'/api/homeworks/getByStudent?homeworkPublicId=' + homeworkPublicId;
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
function sendSolution(values, homeworkPublicId) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({ formValues: values, homeworkPublicId }),
	};
	let reqUrl = '/api/homeworks/addSolutionByStudent';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
