import { homeworkListConstants } from '../constants';
import { homeworkListService } from '../services/homeworkListService';

export const homeworkListActions = {
	getListOfHomeworks,
	clearError,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: homeworkListConstants.CLEAR_ERROR });
	};
}

function getListOfHomeworks(startHomeworkId) {
	return (dispatch) => {
		dispatch(request());
		homeworkListService.getListOfHomeworks(startHomeworkId).then(
			(homeworkPreviews) => {
				dispatch(success(homeworkPreviews));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: homeworkListConstants.HOMEWORK_LIST_REQUEST };
	}
	function success(homeworkPreviews) {
		return {
			type: homeworkListConstants.HOMEWORK_LIST_SUCCESS,
			homeworkPreviews,
		};
	}
	function failure(error) {
		return { type: homeworkListConstants.HOMEWORK_LIST_FAILURE, error };
	}
}
