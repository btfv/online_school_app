import config from '../../config';
import handleResponse from './handleResponse'

export const homeworkListService = {
	getListOfHomeworks,
};

function getListOfHomeworks(startHomeworkId) {
	const requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	};
	return fetch(
		config.API_URL +
			'/api/getListOfHomeworks?' +
			new URLSearchParams({
				offset: startHomeworkId,
			}),
		requestOptions
	).then(handleResponse);
}
