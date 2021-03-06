import { addHomeworkConstants } from '../constants';
import { addHomeworkService } from '../services/addHomeworkService';
import { history } from '../store';
import { homeworkListActions } from './homeworkListActions';

export const addHomeworkActions = {
	addHomework,
	clearError,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: addHomeworkConstants.CLEAR_ERROR });
	};
}

function addHomework(values) {
	return (dispatch) => {
		dispatch(request());
		addHomeworkService.addHomework(values).then(
			() => {
				dispatch(success());
				dispatch(homeworkListActions.clearList());
				history.push('/dashboard');
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};
	function success() {
		return { type: addHomeworkConstants.ADD_HOMEWORK_SUCCESS };
	}
	function failure(error) {
		return { type: addHomeworkConstants.ADD_HOMEWORK_FAILURE, error };
	}
	function request() {
		return { type: addHomeworkConstants.ADD_HOMEWORK_REQUEST };
	}
}
