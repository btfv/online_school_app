import { solutionConstants } from '../constants';
import { initialState } from '../store';
export default function solutionReducer(
	state = initialState.solutionReducer,
	action
) {
	switch (action.type) {
		case solutionConstants.SOLUTION_REQUEST:
			return {
				...state,
				loadingSolution: true,
			};
		case solutionConstants.SOLUTION_SUCCESS:
			return {
				...state,
				loadedSolution: true,
				loadingSolution: false,
				solution: action.solutionDocument,
			};
		case solutionConstants.SOLUTION_FAILURE:
			return {
				...state,
				gettingSolution: false,
				loadedSolution: true,
				error: action.error,
			};
		case solutionConstants.CLEAR_ERROR:
			return { ...state, error: null };
		case solutionConstants.CLEAR_SOLUTION:
			return { ...initialState.solutionReducer };

		case solutionConstants.CHECK_SOLUTION_REQUEST:
			return { ...state, checkingSolution: true };
		case solutionConstants.CHECK_SOLUTION_SUCCESS:
			return { ...state, checkingSolution: false };
		case solutionConstants.CHECK_SOLUTION_FAILURE:
			return { ...state, checkingSolution: false, error: action.error };

		default:
			return state;
	}
}
