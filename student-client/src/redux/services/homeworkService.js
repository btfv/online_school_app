import config from '../../config';
import handleResponse from './handleResponse';

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
	let reqUrl = '/api/getHomework/' + homeworkPublicId;
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
function sendSolution(values, homeworkPublicId) {
	const answers = Object.entries(values).map(([key, value]) => {
		return { taskPublicId: key, answer: value };
	});
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({ answers, homeworkPublicId }),
	};
	const reqUrl = '/api/sendAnswers/';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
