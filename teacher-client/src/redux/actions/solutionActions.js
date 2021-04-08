import { solutionConstants } from '../constants';
import { solutionService } from '../services/solutionService';

export const solutionActions = {
	getSolution,
	clearError,
	clearSolution,
	checkSolution,
};

function clearSolution() {
	return (dispatch) => {
		dispatch({ type: solutionConstants.CLEAR_SOLUTION });
	};
}

function getSolution(homeworkPublicId, solutionPublicId) {
	return (dispatch) => {
		dispatch(request());
		solutionService.getSolution(homeworkPublicId, solutionPublicId).then(
			(solutionDocument) => {
				dispatch(success(solutionDocument));
			},
			(error) => {
				dispatch(failure(error.toString()));
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

function checkSolution(values, dispatch, props) {
	const { homeworkPublicId, solutionPublicId } = props.match.params;
	return (dispatch) => {
		dispatch(request());
		solutionService
			.checkSolution(homeworkPublicId, solutionPublicId, values)
			.then(() => {
				dispatch(success());
				dispatch({ type: solutionConstants.CLEAR_SOLUTION });
			})
			.catch((error) => {
				dispatch(failure(error));
			});
	};
	function request() {
		return { type: solutionConstants.CHECK_SOLUTION_REQUEST };
	}
	function success() {
		return { type: solutionConstants.CHECK_SOLUTION_SUCCESS };
	}
	function failure(error) {
		return { type: solutionConstants.CHECK_SOLUTION_FAILURE, error };
	}
}
