import config from '../../config';
import handleResponse from './handleResponse';

export const homeworkService = {
	getHomework,
	addTask,
	removeTask,
	removeHomework,
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
function addTask(values) {
	var requestBody = {
		homeworkPublicId: values.homeworkPublicId,
		maxPoints: parseInt(values.taskPoints),
		condition: values.taskText,
	};
	switch (values.taskType) {
		case 'options':
			requestBody.taskType = 1;
			requestBody.answer = values.optionList.map((option) => {
				return option.isCorrect;
			});
			requestBody.options = values.optionList.map((option) => {
				return option.optionText;
			});
			break;
		case 'stringAnswer':
			requestBody.taskType = 2;
			requestBody.answer = values.taskStringAnswer;
			break;
		case 'detailedAnswer':
			requestBody.taskType = 3;
			break;
	}
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
	const reqUrl = '/api/addTask';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}

function removeTask(homeworkPublicId, taskPublicId) {
	const requestBody = { homeworkPublicId, taskPublicId };
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
	let reqUrl = '/api/removeTask';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}

function removeHomework(homeworkPublicId) {
	const requestBody = { homeworkPublicId };
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
	let reqUrl = '/api/removeHomework';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
