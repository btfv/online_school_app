import { solutionConstants } from '../constants';
import { initialState } from '../store';
export default function solutionReducer(state = initialState, action) {
	switch (action.type) {
		case solutionConstants.SOLUTION_REQUEST:
			return {
				...state,
				gettingSolution: true,
			};
		case solutionConstants.SOLUTION_SUCCESS:
			return {
				...state,
				gettingSolution: false,
				solutionData: action.solutionDocument,
			};
		case solutionConstants.SOLUTION_FAILURE:
			return {
				...state,
				gettingSolution: false,
				error: action.error,
			};
		case solutionConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
