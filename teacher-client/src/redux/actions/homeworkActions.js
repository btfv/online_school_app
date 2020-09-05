import { homeworkConstants } from '../constants';
import { homeworkService } from '../services/homeworkService';
import { reset } from 'redux-form';

export const homeworkActions = {
	getHomework,
	addTask,
	clearError,
	removeTask,
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

function addTask(values, dispatch, props) {
	const homeworkPublicId = props.homework.publicId;
	return (dispatch) => {
		dispatch(request());
		homeworkService.addTask({ ...values, homeworkPublicId }).then(
			() => {
				dispatch(reset('addTaskForm'));
				dispatch(success());
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: homeworkConstants.ADD_TASK_REQUEST };
	}
	function success() {
		return { type: homeworkConstants.ADD_TASK_SUCCESS };
	}
	function failure(error) {
		return { type: homeworkConstants.ADD_TASK_FAILURE, error };
	}
}

function clearError() {
	return (dispatch) => {
		dispatch({ type: homeworkConstants.CLEAR_ERROR });
	};
}

function removeTask(homeworkPublicId, taskPublicId) {
	return (dispatch) => {
		homeworkService.removeTask(homeworkPublicId, taskPublicId).then(
			() => {
				dispatch(success());
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};
	function success() {
		return { type: homeworkConstants.REMOVE_TASK_SUCCESS };
	}
	function failure(error) {
		return { type: homeworkConstants.REMOVE_TASK_FAILURE, error };
	}
}
