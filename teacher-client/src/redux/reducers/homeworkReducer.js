import { homeworkConstants } from '../constants';
import { initialState } from '../store';
export default function homeworkReducer(state = initialState, action) {
	switch (action.type) {
		case homeworkConstants.HOMEWORK_REQUEST:
			return {
				...state,
				gettingHomework: true,
				firstAttempt: true,
				addedTask: false,
			};
		case homeworkConstants.HOMEWORK_SUCCESS:
			return {
				...state,
				gettingHomework: false,
				homework: action.homeworkDocument,
			};
		case homeworkConstants.HOMEWORK_FAILURE:
			return { ...state, error: action.error, gettingHomework: false };
		case homeworkConstants.ADD_TASK_REQUEST:
			return { ...state };
		case homeworkConstants.ADD_TASK_SUCCESS:
			return { ...state, addedTask: true };
		case homeworkConstants.ADD_TASK_FAILURE:
			return { ...state, error: action.error };

		case homeworkConstants.REMOVE_TASK_SUCCESS:
			return { ...state, firstAttempt: false, homework: {} };
		case homeworkConstants.REMOVE_TASK_FAILURE:
			return { ...state, error: action.error };

		case homeworkConstants.REMOVE_HOMEWORK_SUCCESS:
			return { ...state };
		case homeworkConstants.REMOVE_HOMEWORK_FAILURE:
			return { ...state, error: action.error };

		case homeworkConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
