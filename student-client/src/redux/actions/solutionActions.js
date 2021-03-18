import { solutionConstants } from '../constants';
import { solutionService } from '../services/solutionService';
import { history } from '../store'
export const solutionActions = {
	getSolution,
	clearError
};

function getSolution(homeworkPublicId, solutionPublicId) {
	return (dispatch) => {
		dispatch(request());
		solutionService.getSolution(homeworkPublicId, solutionPublicId).then(
			(solutionDocument) => {
				dispatch(success(solutionDocument));
			},
			(error) => {
				dispatch(failure(error.toString()));
				history.push('/dashboard');
			}
		);
	};

	function request() {
		return { type: solutionConstants.SOLUTION_REQUEST };
	}
	function success(solutionDocument) {
		return { type: solutionConstants.SOLUTION_SUCCESS, solutionDocument };
	}
	function failure(error) {
		return { type: solutionConstants.SOLUTION_FAILURE, error };
	}
}

function clearError() {
	return (dispatch) => {
		dispatch({ type: solutionConstants.CLEAR_ERROR });
	};
}