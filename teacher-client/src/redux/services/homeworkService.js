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
	let reqUrl =
		'/api/homeworks/getByTeacher?homeworkPublicId=' + homeworkPublicId;
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}
function addTask(values) {
	var requestBody = {};
	requestBody.homeworkPublicId = values.homeworkPublicId;
	requestBody.taskText = values.taskText;
	switch (values.taskType) {
		case 'options':
			requestBody.taskType = 1;
			requestBody.taskOptions = values.optionList.map((option) => {
				return {
					isCorrect: option.optionIsCorrect,
					optionText: option.optionText,
				};
			});
			break;
		case 'stringAnswer':
			requestBody.taskType = 2;
			requestBody.taskStringAnswer = values.stringAnswer;
			break;
		case 'detailedAnswer':
			requestBody.taskType = 3;
			requestBody.taskDetailedAnswer = values.detailedAnswer;
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
	let reqUrl = '/api/homeworks/addTask';
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
	let reqUrl = '/api/homeworks/removeTask';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}

function removeHomework(homeworkPublicId){
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
	let reqUrl = '/api/homeworks/removeHomework';
	return fetch(config.API_URL + reqUrl, requestOptions).then(handleResponse);
}