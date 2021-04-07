import { receivedTeachersConstants } from '../constants';
import { initialState } from '../store';

export default function receivedTeachersReducer(
	state = initialState.receivedTeachersReducer,
	action
) {
	switch (action.type) {
		case receivedTeachersConstants.TEACHER_LIST_REQUEST:
			return {
				...state,
				loadingTeachers: true,
			};
		case receivedTeachersConstants.TEACHER_LIST_SUCCESS:
			return {
				...state,
				loadingTeachers: false,
				loadedTeachers: true,
				receivedTeachers: state.receivedTeachers.concat(
					action.receivedTeachers
				),
			};
		case receivedTeachersConstants.TEACHER_LIST_FAILURE:
			return {
				...state,
				loadingTeachers: false,
				loadedTeachers: true,
				error: action.error,
			};
		case receivedTeachersConstants.CLEAR_TEACHER_LIST:
			return {
				...initialState.receivedTeachersReducer,
			};

		case receivedTeachersConstants.SEARCH_TEACHER_LIST_REQUEST:
			return {
				...state,
				searchingTeachers: true,
			};
		case receivedTeachersConstants.SEARCH_TEACHER_LIST_SUCCESS:
			return {
				...state,
				searchedTeachers: true,
				searchingTeachers: false,
				searchedTeachersList: action.teachers,
			};
		case receivedTeachersConstants.SEARCH_TEACHER_LIST_FAILURE:
			return {
				...state,
				searchedTeachers: true,
				searchingTeachers: false,
				error: action.error,
			};

		case receivedTeachersConstants.CLEAR_TEACHER_SEARCH:
			return {
				...state,
				searchedTeachers: false,
				searchingTeachers: false,
				searchedTeachersList: [],
			};

		case receivedTeachersConstants.ADD_TEACHER_TO_HOMEWORK_FAILURE:
			return {
				...state,
				error: action.error,
			};
		case receivedTeachersConstants.ADD_TEACHER_TO_HOMEWORK_SUCCESS:
			return {
				...state,
				receivedTeachers: [],
				loadedTeachers: false,
			};
		case receivedTeachersConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
