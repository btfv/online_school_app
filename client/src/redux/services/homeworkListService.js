import config from '../../config';

export const homeworkListService = {
	getListOfHomeworks,
};

function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401 || response.status === 400) {
				document.location.reload(true);
			}
			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}

function getListOfHomeworks(startHomeworkId) {
	const requestOptions = {
		method: 'GET',
        mode: 'cors',
        credentials: 'include'
	};
	return fetch(
		config.API_URL + '/api/homeworks/getPreviewsByStudent?' + 'startHomeworkId=' + startHomeworkId,
		requestOptions
	)
		.then(handleResponse);
}
