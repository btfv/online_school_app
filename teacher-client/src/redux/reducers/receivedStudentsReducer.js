import { receivedStudentsConstants } from '../constants';
import { initialState } from '../store';

export default function receivedStudentsReducer(state = initialState.receivedStudentsReducer, action) {
	switch (action.type) {
		case receivedStudentsConstants.STUDENT_LIST_REQUEST:
			return {
				...state,
				loadingStudents: true,
			};
		case receivedStudentsConstants.STUDENT_LIST_SUCCESS:
			return {
				...state,
				loadingStudents: false,
				loadedStudents: true,
				receivedStudents: state.receivedStudents.concat(
					action.receivedStudents
				),
			};
		case receivedStudentsConstants.STUDENT_LIST_FAILURE:
			return {
				...state,
				loadingStudents: false,
				loadedStudents: true,
				error: action.error,
			};
		case receivedStudentsConstants.CLEAR_STUDENT_LIST:
			return {
				...state,
				searchedStudentsList: [],
			};

		case receivedStudentsConstants.SEARCH_LIST_REQUEST:
			return {
				...state,
				searchingStudents: true,
			};
		case receivedStudentsConstants.SEARCH_LIST_SUCCESS:
			return {
				...state,
				searchedStudents: true,
				searchingStudents: false,
				searchedStudentsList: action.students,
			};
		case receivedStudentsConstants.SEARCH_LIST_FAILURE:
			return {
				...state,
				searchedStudents: true,
				searchingStudents: false,
				error: action.error,
			};
		case receivedStudentsConstants.ADD_STUDENT_TO_HOMEWORK_FAILURE:
			return {
				...state,
				error: action.error,
			};
		case receivedStudentsConstants.ADD_STUDENT_TO_HOMEWORK_SUCCESS:
			return {
				...state,
				receivedStudents: [],
				loadedStudents: false,
			};
		case receivedStudentsConstants.CLEAR_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
