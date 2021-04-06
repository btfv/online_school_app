import { homeworkListConstants } from '../constants';
import { initialState } from '../store';

export default function homeworkListReducer(state = initialState.homeworkListReducer, action) {
	switch (action.type) {
		case homeworkListConstants.HOMEWORK_LIST_REQUEST:
			return {
				...state,
				loadingHomeworkPreviews: true,
			};
		case homeworkListConstants.HOMEWORK_LIST_SUCCESS:
			return {
				...state,
				loadingHomeworkPreviews: false,
				loadedHomeworkPreviews: true,
				homeworkPreviews: state.homeworkPreviews.concat(
					action.homeworkPreviews
				),
			};
		case homeworkListConstants.HOMEWORK_LIST_FAILURE:
			return {
				...state,
				loadingHomeworkPreviews: false,
				loadedHomeworkPreviews: true,
				error: action.error,
			};
		case homeworkListConstants.CLEAR_LIST:
			return {
				...state,
				loadingHomeworkPreviews: false,
				loadedHomeworkPreviews: false,
				homeworkPreviews: [],
			};
		case homeworkListConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
