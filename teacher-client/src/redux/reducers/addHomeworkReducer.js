import { addHomeworkConstants } from '../constants';
import { initialState } from '../store';

export default function addHomeworkReducer(state = initialState, action) {
	switch (action.type) {
		case addHomeworkConstants.ADD_HOMEWORK_REQUEST:
			return {
				...state,
				addingHomework: true,
			};
		case addHomeworkConstants.ADD_HOMEWORK_SUCCESS:
			return {
				...state,
				addingHomework: false,
				addedHomework: true,
			};
		case addHomeworkConstants.ADD_HOMEWORK_FAILURE:
			return { ...state, error: action.error, addingHomework: false };
		case addHomeworkConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
