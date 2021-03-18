import { homeworkListConstants } from '../constants';
import { homeworkListService } from '../services/homeworkListService';

export const homeworkListActions = {
	getListOfHomeworks,
	clearError,
	clearHomeworkList,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: homeworkListConstants.CLEAR_ERROR });
	};
}

function clearHomeworkList() {
	return (dispatch) => {
		dispatch({ type: homeworkListConstants.CLEAR_HOMEWORK_LIST });
	};
}

function getListOfHomeworks(startHomeworkId) {
	return (dispatch) => {
		dispatch(request());
		homeworkListService.getListOfHomeworks(startHomeworkId).then(
			(previews) => {
				dispatch(success(previews));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: homeworkListConstants.HOMEWORK_LIST_REQUEST };
	}
	function success(previews) {
		return {
			type: homeworkListConstants.HOMEWORK_LIST_SUCCESS,
			previews,
		};
	}
	function failure(error) {
		return { type: homeworkListConstants.HOMEWORK_LIST_FAILURE, error };
	}
}
