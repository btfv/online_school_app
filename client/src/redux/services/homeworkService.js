import config from '../../config';

export const homeworkService = {
	getHomework,
};

function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401 || response.status === 400) {
				logout();
				document.location.reload(true);
			}
			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}
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
