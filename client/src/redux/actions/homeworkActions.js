import { homeworkConstants } from '../constants';
import { homeworkService } from '../services/homeworkService';

export const homeworkActions = {
	getHomework,
	sendHomework
};

function getHomework(homeworkPublicId) {
	return (dispatch) => {
		dispatch(request());
		homeworkService.getHomework(homeworkPublicId).then(
			(homeworkDocument) => {
				dispatch(success(homeworkDocument));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: homeworkConstants.HOMEWORK_REQUEST };
	}
	function success(homeworkDocument) {
		return { type: homeworkConstants.HOMEWORK_SUCCESS, homeworkDocument};
	}
	function failure(error) {
		return { type: homeworkConstants.HOMEWORK_FAILURE, error };
	}
}

function sendHomework(values) {
	console.log(values);
	/*return (dispatch) => {
		dispatch(request());
		homeworkService.getHomework(homeworkPublicId).then(
			(homeworkDocument) => {
				dispatch(success(homeworkDocument));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};*/

	function request() {
		return { type: homeworkConstants.HOMEWORK_REQUEST };
	}
	function success(homeworkDocument) {
		return { type: homeworkConstants.HOMEWORK_SUCCESS, homeworkDocument};
	}
	function failure(error) {
		return { type: homeworkConstants.HOMEWORK_FAILURE, error };
	}
}
