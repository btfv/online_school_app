import config from '../../config';
import handleResponse from './handleResponse';

export const addHomeworkService = {
	addHomework,
};

function addHomework(value) {
	const reqBody = new FormData();
	for (let prop in value) {
		if (prop !== 'homeworkAttachments') reqBody.append(prop, value[prop]);
	}

	if (value.homeworkAttachments) {
		let files = Array.from(value.homeworkAttachments);

		files.map((file, index) => {
			reqBody.append(index, file);
		});
	}
	const requestOptions = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: reqBody,
	};
	return fetch(
		config.API_URL + '/api/createHomework',
		requestOptions
	).then(handleResponse);
}
