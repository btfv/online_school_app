import config from '../../config';
import handleResponse from './handleResponse'

export const solutionListService = {
	getListOfSolutions,
};

function getListOfSolutions(startSolutionId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL +
			'/api/homeworks/getSolutionPreviewsByStudent?' +
			'startSolutionId=' +
			startSolutionId,
		requestOptions
	).then(handleResponse);
}
