import config from '../../config';
import handleResponse from './handleResponse';

export const solutionService = {
	getSolution,
};

function getSolution(homeworkPublicId, solutionPublicId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	let reqUrl =
		'/api/getSolution/' +
		homeworkPublicId +
		'.' +
		solutionPublicId;
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
