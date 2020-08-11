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
			return { ...state, error: action.error };
		default:
			return state;
	}
}
