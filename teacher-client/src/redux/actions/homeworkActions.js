import { homeworkConstants, homeworkListConstants } from '../constants';
import { homeworkService } from '../services/homeworkService';
import { reset } from 'redux-form';
import { history } from '../store';

export const homeworkActions = {
	getHomework,
	addTask,
	clearError,
	removeTask,
	removeHomework,
	clearHomework,
};

function clearHomework() {
	return (dispatch) => {
		dispatch({ type: homeworkConstants.CLEAR_HOMEWORK });
	};
}

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
	const homeworkPublicId = props.match.params.publicId;
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

function removeHomework(homeworkPublicId) {
	return (dispatch) => {
		homeworkService.removeHomework(homeworkPublicId).then(
			() => {
				dispatch(success());
				dispatch({ type: homeworkListConstants.CLEAR_LIST });
				history.push('/dashboard');
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};
	function success() {
		return { type: homeworkConstants.REMOVE_HOMEWORK_SUCCESS };
	}
	function failure(error) {
		return { type: homeworkConstants.REMOVE_HOMEWORK_FAILURE, error };
	}
}
