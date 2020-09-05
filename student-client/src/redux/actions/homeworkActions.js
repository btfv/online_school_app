import { homeworkConstants } from '../constants';
import { homeworkService } from '../services/homeworkService';

export const homeworkActions = {
	getHomework,
	sendSolution,
	clearError,
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
		return { type: homeworkConstants.HOMEWORK_SUCCESS, homeworkDocument };
	}
	function failure(error) {
		return { type: homeworkConstants.HOMEWORK_FAILURE, error };
	}
}

function sendSolution(values, dispatch, props) {
	let homeworkPublicId = props.homework.publicId;
	return (dispatch) => {
		dispatch(request());
		homeworkService.sendSolution(values, homeworkPublicId).then(
			(homeworkDocument) => {
				dispatch(success());
				history.push('/dashboard');
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: homeworkConstants.SEND_SOLUTION_REQUEST };
	}
	function success() {
		return { type: homeworkConstants.SEND_SOLUTION_SUCCESS };
	}
	function failure(error) {
		return { type: homeworkConstants.SEND_SOLUTION_FAILURE, error };
	}
}

function clearError() {
	return (dispatch) => {
		dispatch({ type: homeworkConstants.CLEAR_ERROR });
	};
}
