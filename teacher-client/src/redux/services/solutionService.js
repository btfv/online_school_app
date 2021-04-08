import config from '../../config';
import handleResponse from './handleResponse';

export const solutionService = {
	getSolution,
	checkSolution,
};

function getSolution(homeworkPublicId, solutionPublicId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	let reqUrl =
		'/api/getSolution/' + homeworkPublicId + '.' + solutionPublicId;
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}

function checkSolution(homeworkPublicId, solutionPublicId, values) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({
			homeworkPublicId,
			solutionPublicId,
			comments: values,
		}),
	};
	let reqUrl = '/api/checkSolution/';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
