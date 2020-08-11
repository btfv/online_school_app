import { homeworkListConstants } from '../constants';
import { initialState } from '../store'

export default function homeworkListReducer(state = initialState, action) {
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
				homeworkPreviews: state.homeworkPreviews.concat(action.homeworkPreviews),
			};
		case homeworkListConstants.HOMEWORK_LIST_FAILURE:
			return {
				...state,
				loadingHomeworkPreviews: false,
				loadedHomeworkPreviews: false,
				error: action.error,
			};
		default:
			return state;
	}
}
