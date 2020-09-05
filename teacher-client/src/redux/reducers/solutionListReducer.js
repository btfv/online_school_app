import { solutionListConstants } from '../constants';
import { initialState } from '../store';

export default function solutionListReducer(state = initialState, action) {
	switch (action.type) {
		case solutionListConstants.SOLUTION_LIST_REQUEST:
			return {
				...state,
				loadingSolutionPreviews: true,
			};
		case solutionListConstants.SOLUTION_LIST_SUCCESS:
			return {
				...state,
				loadingSolutionPreviews: false,
				loadedSolutionPreviews: true,
				solutionPreviews: state.solutionPreviews.concat(
					action.solutionPreviews
				),
			};
		case solutionListConstants.SOLUTION_LIST_FAILURE:
			return {
				...state,
				loadingSolutionPreviews: false,
				loadedSolutionPreviews: true,
				error: action.error,
			};
		case solutionListConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
