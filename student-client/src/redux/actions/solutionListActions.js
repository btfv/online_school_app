import { solutionListConstants } from '../constants';
import { solutionListService } from '../services/solutionListService';

export const solutionListActions = {
	getListOfSolutions,
	clearError,
};

function clearError() {
	return (dispatch) => {
		dispatch({ type: solutionListConstants.CLEAR_ERROR });
	};
}

function getListOfSolutions(startSolutionId) {
	return (dispatch) => {
		dispatch(request());
		solutionListService.getListOfSolutions(startSolutionId).then(
			(solutionPreviews) => {
				dispatch(success(solutionPreviews));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: solutionListConstants.SOLUTION_LIST_REQUEST };
	}
	function success(solutionPreviews) {
		return {
			type: solutionListConstants.SOLUTION_LIST_SUCCESS,
			solutionPreviews,
		};
	}
	function failure(error) {
		return { type: solutionListConstants.SOLUTION_LIST_FAILURE, error };
	}
}
