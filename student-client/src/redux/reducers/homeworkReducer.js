import { homeworkConstants } from '../constants';
import { initialState } from '../store';
export default function homeworkReducer(state = initialState, action) {
	switch (action.type) {
		case homeworkConstants.HOMEWORK_REQUEST:
			return {
				...state,
				gettingHomework: true,
			};
		case homeworkConstants.HOMEWORK_SUCCESS:
			return {
				...state,
				gettingHomework: false,
				homework: action.homeworkDocument,
			};
		case homeworkConstants.HOMEWORK_FAILURE:
			return { ...state, error: action.error, gettingHomework: false };
		case homeworkConstants.SEND_SOLUTION_REQUEST:
			return { ...state, sendingSolution: true };
		case homeworkConstants.SEND_SOLUTION_SUCCESS:
			return { sendingSolution: false, solutionSended: true };
		case homeworkConstants.SEND_SOLUTION_FAILURE:
			return { ...state, error: action.error, sendingSolution: false };

		case homeworkConstants.CLEAR_HOMEWORK:
			return { ...initialState };

		case homeworkConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
